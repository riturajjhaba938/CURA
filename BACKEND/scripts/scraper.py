"""
CURA - Multi-Strategy Reddit Scraper (No API Keys Required)
Uses public JSON endpoints, RSS feeds, and Pushshift archive.
"""

import requests
import pymongo
import sys
import json
import os
import time
import random
import feedparser
from collections import deque
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# ─── Configuration ────────────────────────────────────────────────────────────

SUBREDDITS = [
    # ── India-specific (scraped first) ──
    "india", "IndianMedSchool", "DoctorsOfIndia", "Ayurveda",
    "indianents", "TwoXIndia", "AskIndia",
    # ── Global health ──
    "askdocs", "Dermatology", "SkincareAddiction", "Accutane",
    "eczema", "Psoriasis", "tretinoin", "Rosacea", "acne",
    "medical", "healthanxiety", "ChronicPain", "ChronicIllness", "Autoimmune",
    "ADHD", "depression", "Anxiety", "bipolar", "mentalhealth", "antidepressants",
    "Migraine", "Fibromyalgia", "diabetes",
    "Nootropics", "Supplements",
]

# Quick mode: Only top 3 global subs for speed (~15-20 sec)
QUICK_SUBREDDITS = [
    "askdocs", "ChronicPain", "depression",
]

SEARCH_SORTS = ["relevance", "top", "new", "comments"]
QUICK_SORTS = ["relevance"]  # only 1 sort in quick mode

USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

REQUEST_TIMEOUT = 5  # Reduced for demo speed
MAX_RETRIES = 2       # Reduced for demo speed
BASE_DELAY = 0.2  # Reduced delay for demo speed
MAX_COMMENT_DEPTH_PAGES = 10 # Reduced for demo speed


# ─── Scraper Class ────────────────────────────────────────────────────────────

class RedditMaxScraper:
    """
    Scrapes Reddit using public endpoints — no API credentials needed.
    Three-pass strategy:
      1. Search across all subreddits with 4 sort methods
      2. Hot / Top posts filtered for drug mentions
      3. Pushshift archive for historical data (2005-2023)
    """

    def __init__(self, quick_mode=False):
        self.quick_mode = quick_mode

        # MongoDB setup
        mongo_uri = os.getenv("MONGODB_URI", os.getenv("MONGO_URI", "mongodb://localhost:27017"))
        self.mongo_client = pymongo.MongoClient(mongo_uri)
        db = self.mongo_client["medical_ai_db"]
        self.posts = db["posts"]
        self.comments = db["comments"]

        # Ensure unique indexes
        self.posts.create_index("post_id", unique=True)
        self.comments.create_index("comment_id", unique=True)

        # HTTP session for connection pooling
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "application/json",
        })

        # Counters
        self.total_posts = 0
        self.total_comments = 0
        self.subreddits_scraped = set()

    # ── HTTP helper ───────────────────────────────────────────────────────

    def get_with_retry(self, url, params=None):
        """GET with exponential backoff, respects 429 Retry-After."""
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                resp = self.session.get(
                    url, params=params, timeout=REQUEST_TIMEOUT
                )

                # Rate-limited — honour Retry-After header
                if resp.status_code == 429:
                    wait = int(resp.headers.get("Retry-After", 10))
                    self._log(f"  429 rate-limited, waiting {wait}s …")
                    time.sleep(wait)
                    continue

                if resp.status_code >= 500:
                    raise requests.exceptions.HTTPError(
                        f"Server error {resp.status_code}"
                    )

                resp.raise_for_status()
                return resp

            except (requests.exceptions.RequestException, ValueError) as exc:
                delay = BASE_DELAY * (2 ** (attempt - 1)) + random.uniform(0, 1)
                self._log(
                    f"  Attempt {attempt}/{MAX_RETRIES} failed ({exc}), "
                    f"retrying in {delay:.1f}s …"
                )
                time.sleep(delay)

        return None  # all retries exhausted

    # ── Comment extraction (BFS / iterative) ──────────────────────────────

    def extract_all_comments(self, comment_data, post_id):
        """
        Walk Reddit's nested comment tree with a queue (BFS).
        Saves each comment to MongoDB if meaningful.
        """
        if not comment_data:
            return 0

        saved = 0
        queue = deque()

        # Seed the queue with top-level comment children
        if isinstance(comment_data, dict):
            children = (
                comment_data.get("data", {}).get("children", [])
            )
            queue.extend(children)
        elif isinstance(comment_data, list):
            for item in comment_data:
                children = item.get("data", {}).get("children", [])
                queue.extend(children)

        while queue:
            node = queue.popleft()
            if not isinstance(node, dict):
                continue

            kind = node.get("kind", "")
            data = node.get("data", {})

            # "more" stubs — skip (would need extra requests)
            if kind == "more":
                continue

            # Only process comment nodes (kind == "t1")
            if kind != "t1":
                continue

            body = data.get("body", "")
            comment_id = data.get("id", "")

            if (
                body
                and body not in ("[deleted]", "[removed]")
                and len(body) > 20
                and comment_id
            ):
                doc = {
                    "comment_id": comment_id,
                    "post_id": post_id,
                    "text": body,
                    "upvotes": data.get("ups", 0),
                    "created_at": datetime.utcfromtimestamp(
                        data.get("created_utc", 0)
                    ),
                }
                try:
                    self.comments.insert_one(doc)
                    saved += 1
                    self.total_comments += 1
                except pymongo.errors.DuplicateKeyError:
                    pass

            # Enqueue nested replies
            replies = data.get("replies")
            if isinstance(replies, dict):
                reply_children = (
                    replies.get("data", {}).get("children", [])
                )
                queue.extend(reply_children)

        return saved

    # ── Fetch full comment thread for a post ──────────────────────────────

    def fetch_comments_for_post(self, permalink, post_id):
        """Fetch the full comment tree for a single post."""
        url = f"https://www.reddit.com{permalink}.json"
        params = {"limit": MAX_COMMENT_DEPTH_PAGES, "sort": "top"}
        resp = self.get_with_retry(url, params=params)
        if resp is None:
            return 0

        try:
            data = resp.json()
        except (ValueError, json.JSONDecodeError):
            return 0

        # Reddit returns [post_listing, comment_listing]
        if isinstance(data, list) and len(data) >= 2:
            return self.extract_all_comments(data[1], post_id)
        return 0

    # ── Save a post document ─────────────────────────────────────────────

    def save_post(self, post_data, drug_name, subreddit_name):
        """Save a post dict to MongoDB. Returns True if newly inserted."""
        post_id = post_data.get("id", "")
        if not post_id:
            return False

        doc = {
            "post_id": post_id,
            "subreddit": post_data.get("subreddit", subreddit_name),
            "title": post_data.get("title", ""),
            "selftext": post_data.get("selftext", ""),
            "created_at": datetime.utcfromtimestamp(
                post_data.get("created_utc", 0)
            ),
            "query_drug": drug_name.lower(),
        }
        try:
            self.posts.insert_one(doc)
            self.total_posts += 1
            return True
        except pymongo.errors.DuplicateKeyError:
            return False  # already have it

    # ── PASS 1: Search endpoint (4 sort modes) ───────────────────────────

    def pass1_search(self, drug_name):
        """Search every subreddit with sort methods."""
        subs = QUICK_SUBREDDITS if self.quick_mode else SUBREDDITS
        sorts = QUICK_SORTS if self.quick_mode else SEARCH_SORTS
        max_pages = 1 if self.quick_mode else 4
        result_limit = 10 if self.quick_mode else 100
        self._log(f"═══ Pass 1: Search ({len(sorts)} sort, {len(subs)} subs) ═══")

        for sub in subs:
            for sort in sorts:
                self._log(f"  r/{sub} sort={sort}")
                after = None
                pages = 0

                while pages < max_pages:
                    url = f"https://www.reddit.com/r/{sub}/search.json"
                    params = {
                        "q": drug_name,
                        "restrict_sr": 1,
                        "limit": result_limit,
                        "sort": sort,
                        "t": "all",
                    }
                    if after:
                        params["after"] = after

                    resp = self.get_with_retry(url, params)
                    if resp is None:
                        break

                    try:
                        body = resp.json()
                    except (ValueError, json.JSONDecodeError):
                        break

                    children = body.get("data", {}).get("children", [])
                    if not children:
                        break

                    for child in children:
                        d = child.get("data", {})
                        is_new = self.save_post(d, drug_name, sub)
                        # Skip comment fetching in quick mode for speed
                        # Wait, we need comments for the AI pipeline! We will fetch them but limit to top 3 in quick mode.
                        if is_new:
                            permalink = d.get("permalink", "")
                            if permalink:
                                if self.quick_mode and getattr(self, "quick_comments_fetched", 0) > 3:
                                    continue
                                self.fetch_comments_for_post(
                                    permalink, d["id"]
                                )
                                self.quick_comments_fetched = getattr(self, "quick_comments_fetched", 0) + 1

                    after = body.get("data", {}).get("after")
                    if not after:
                        break
                    pages += 1
                    time.sleep(BASE_DELAY + random.uniform(0, 0.3))

                self.subreddits_scraped.add(sub)
                time.sleep(BASE_DELAY + random.uniform(0, 0.5))

    # ── PASS 2: Hot / Top posts filtered for drug mentions ───────────────

    def pass2_hot_top(self, drug_name):
        """Fetch hot and top posts, filter for drug mention in title/body."""
        self._log("═══ Pass 2: Hot / Top posts (drug filter) ═══")
        drug_lower = drug_name.lower()

        subs = QUICK_SUBREDDITS if self.quick_mode else SUBREDDITS
        for sub in subs:
            for listing in ("hot", "top"):
                url = f"https://www.reddit.com/r/{sub}/{listing}.json"
                params = {"limit": 100, "t": "all"}
                resp = self.get_with_retry(url, params)
                if resp is None:
                    continue

                try:
                    body = resp.json()
                except (ValueError, json.JSONDecodeError):
                    continue

                children = body.get("data", {}).get("children", [])
                for child in children:
                    d = child.get("data", {})
                    title = d.get("title", "").lower()
                    selftext = d.get("selftext", "").lower()

                    if drug_lower in title or drug_lower in selftext:
                        is_new = self.save_post(d, drug_name, sub)
                        if is_new:
                            permalink = d.get("permalink", "")
                            if permalink:
                                self.fetch_comments_for_post(
                                    permalink, d["id"]
                                )

                time.sleep(BASE_DELAY + random.uniform(0, 0.5))

    # ── PASS 3: Pushshift / PullPush archive ─────────────────────────────

    def pass3_pushshift(self, drug_name):
        """Query Pushshift (PullPush mirror) for historical posts."""
        self._log("═══ Pass 3: Pushshift archive ═══")

        subs = QUICK_SUBREDDITS if self.quick_mode else SUBREDDITS
        for sub in subs:
            self._log(f"  Pushshift r/{sub}")
            url = "https://api.pullpush.io/reddit/search/submission/"
            params = {
                "q": drug_name,
                "subreddit": sub,
                "size": 500,
                "sort": "desc",
                "sort_type": "score",
            }

            resp = self.get_with_retry(url, params)
            if resp is None:
                continue

            try:
                body = resp.json()
            except (ValueError, json.JSONDecodeError):
                continue

            items = body.get("data", [])
            for item in items:
                post_id = item.get("id", "")
                if not post_id:
                    continue

                doc = {
                    "post_id": post_id,
                    "subreddit": item.get("subreddit", sub),
                    "title": item.get("title", ""),
                    "selftext": item.get("selftext", ""),
                    "created_at": datetime.utcfromtimestamp(
                        item.get("created_utc", 0)
                    ),
                    "query_drug": drug_name.lower(),
                }
                try:
                    self.posts.insert_one(doc)
                    self.total_posts += 1
                except pymongo.errors.DuplicateKeyError:
                    pass  # already have it

            time.sleep(BASE_DELAY + random.uniform(0, 1))

    # ── RSS feed bonus (lightweight, recent posts) ────────────────────────

    def bonus_rss(self, drug_name):
        """Quick pass through RSS feeds for very recent posts."""
        self._log("═══ Bonus: RSS feeds ═══")

        for sub in SUBREDDITS:
            rss_url = (
                f"https://www.reddit.com/r/{sub}/search.rss"
                f"?q={drug_name}&restrict_sr=1&limit=50"
            )
            try:
                feed = feedparser.parse(rss_url)
                for entry in feed.entries:
                    # RSS entry ids look like "t3_xxxxx"
                    post_id = entry.get("id", "").replace("t3_", "")
                    if not post_id:
                        continue

                    doc = {
                        "post_id": post_id,
                        "subreddit": sub,
                        "title": entry.get("title", ""),
                        "selftext": entry.get("summary", ""),
                        "created_at": datetime.utcnow(),
                        "query_drug": drug_name.lower(),
                    }
                    try:
                        self.posts.insert_one(doc)
                        self.total_posts += 1
                    except pymongo.errors.DuplicateKeyError:
                        pass

            except Exception as exc:
                self._log(f"  RSS r/{sub} failed: {exc}")

            time.sleep(1)

    # ── Main orchestrator ─────────────────────────────────────────────────

    def scrape_drug(self, drug_name):
        """Run all passes and return summary dict."""
        mode_label = "QUICK" if self.quick_mode else "FULL"
        subs = QUICK_SUBREDDITS if self.quick_mode else SUBREDDITS
        self._log(f'Starting {mode_label} scrape for "{drug_name}"')
        self._log(f"Target subreddits: {len(subs)}")

        start = time.time()

        try:
            self.pass1_search(drug_name)
        except Exception as exc:
            self._log(f"Pass 1 error (continuing): {exc}")

        # Skip pass 2 & 3 in quick mode for speed
        if not self.quick_mode:
            try:
                self.pass2_hot_top(drug_name)
            except Exception as exc:
                self._log(f"Pass 2 error (continuing): {exc}")

            try:
                self.pass3_pushshift(drug_name)
            except Exception as exc:
                self._log(f"Pass 3 error (continuing): {exc}")

            try:
                self.bonus_rss(drug_name)
            except Exception as exc:
                self._log(f"RSS bonus error (continuing): {exc}")

        elapsed = time.time() - start
        self._log(
            f"Done in {elapsed / 60:.1f} min — "
            f"{self.total_posts} posts, {self.total_comments} comments, "
            f"{len(self.subreddits_scraped)} subreddits"
        )

        return {
            "posts": self.total_posts,
            "comments": self.total_comments,
            "subreddits_scraped": len(self.subreddits_scraped),
        }

    # ── Logging (stderr so stdout stays clean for JSON) ───────────────────

    @staticmethod
    def _log(msg):
        print(msg, file=sys.stderr)


# ─── CLI entry point ──────────────────────────────────────────────────────────

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python scraper.py <drug_name> [--quick|--full]"}))
        sys.exit(1)

    drug = sys.argv[1]
    quick = "--quick" in sys.argv  # default: full mode
    scraper = RedditMaxScraper(quick_mode=quick)
    result = scraper.scrape_drug(drug)

    # JSON to stdout for Express controller
    print(json.dumps(result))
