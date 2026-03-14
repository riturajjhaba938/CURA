import praw
import pymongo
import sys
import json
import os
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# --- Reddit (PRAW) Setup ---
reddit = praw.Reddit(
    client_id=os.getenv("REDDIT_CLIENT_ID"),
    client_secret=os.getenv("REDDIT_CLIENT_SECRET"),
    user_agent=os.getenv("REDDIT_USER_AGENT"),
)

# --- MongoDB Setup ---
mongo_client = pymongo.MongoClient(os.getenv("MONGO_URI", "mongodb://localhost:27017"))
db = mongo_client["drug_insights"]
posts_collection = db["posts"]
comments_collection = db["comments"]

# Ensure unique indexes
posts_collection.create_index("post_id", unique=True)
comments_collection.create_index("comment_id", unique=True)

# --- Subreddits to Search ---
SUBREDDITS = ["askdocs", "Dermatology", "SkincareAddiction", "Accutane"]


def scrape_drug(drug_name: str) -> dict:
    """
    Search Reddit for posts about a drug, save posts and comments to MongoDB.
    Returns a summary of what was saved.
    """
    total_posts = 0
    total_comments = 0

    for sub_name in SUBREDDITS:
        try:
            subreddit = reddit.subreddit(sub_name)
            # Check for dummy credentials first
            if os.getenv("REDDIT_CLIENT_ID") == "your_client_id" or not os.getenv("REDDIT_CLIENT_ID"):
                print(f"Using dummy data for r/{sub_name}", file=sys.stderr)
                # Insert 1 dummy post and 2 dummy comments per subreddit
                import uuid
                dummy_post_id = str(uuid.uuid4())[:8]
                post_doc = {
                    "post_id": dummy_post_id,
                    "subreddit": sub_name,
                    "title": f"Dummy post about {drug_name} in {sub_name}",
                    "selftext": f"This is a dummy text mentioning {drug_name}",
                    "created_at": datetime.utcnow(),
                    "query_drug": drug_name.lower(),
                }
                
                try:
                    posts_collection.insert_one(post_doc)
                    total_posts += 1
                except pymongo.errors.DuplicateKeyError:
                    pass

                for i in range(2):
                    comment_doc = {
                        "comment_id": str(uuid.uuid4())[:8],
                        "post_id": dummy_post_id,
                        "text": f"Dummy comment {i} about {drug_name} - dry skin",
                        "upvotes": 10,
                        "created_at": datetime.utcnow(),
                    }
                    try:
                        comments_collection.insert_one(comment_doc)
                        total_comments += 1
                    except pymongo.errors.DuplicateKeyError:
                        pass
                continue

            results = subreddit.search(drug_name, sort="relevance", time_filter="all", limit=25)

            for post in results:
                # Upsert post
                post_doc = {
                    "post_id": post.id,
                    "subreddit": post.subreddit.display_name,
                    "title": post.title,
                    "selftext": post.selftext,
                    "created_at": datetime.utcfromtimestamp(post.created_utc),
                    "query_drug": drug_name.lower(),
                }

                try:
                    posts_collection.insert_one(post_doc)
                    total_posts += 1
                except pymongo.errors.DuplicateKeyError:
                    pass  # Already exists

                # Fetch and save comments
                post.comments.replace_more(limit=0)
                for comment in post.comments.list()[:20]:
                    if not comment.body or comment.body == "[deleted]":
                        continue

                    comment_doc = {
                        "comment_id": comment.id,
                        "post_id": post.id,
                        "text": comment.body,
                        "upvotes": comment.ups,
                        "created_at": datetime.utcfromtimestamp(comment.created_utc),
                    }

                    try:
                        comments_collection.insert_one(comment_doc)
                        total_comments += 1
                    except pymongo.errors.DuplicateKeyError:
                        pass  # Already exists

        except Exception as e:
            print(f"Error scraping r/{sub_name}: {e}", file=sys.stderr)

    return {"posts": total_posts, "comments": total_comments}


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python scraper.py <drug_name>"}))
        sys.exit(1)

    drug = sys.argv[1]
    result = scrape_drug(drug)

    # Output JSON to stdout for the Express controller to capture
    print(json.dumps(result))
