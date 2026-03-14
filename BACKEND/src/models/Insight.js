const mongoose = require("mongoose");

const insightSchema = new mongoose.Schema(
  {
    comment_id: {
      type: String,
      required: true,
      ref: "Comment",
    },
    drug: {
      type: String,
      required: true,
      index: true,
    },
    side_effect: {
      type: String,
      default: "",
    },
    dosage: {
      type: String,
      default: "",
    },
    timeline_marker: {
      type: String,
      default: "",
    },
    credibility_score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Insight", insightSchema);
