const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    post_id: {
      type: String,
      required: true,
      unique: true,
    },
    subreddit: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      required: true,
    },
    query_drug: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
