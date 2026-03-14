const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    comment_id: {
      type: String,
      required: true,
      unique: true,
    },
    post_id: {
      type: String,
      required: true,
      ref: "Post",
    },
    text: {
      type: String,
      required: true,
    },
    upvotes: {
      type: Number,
      default: 0,
    },
    created_at: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
