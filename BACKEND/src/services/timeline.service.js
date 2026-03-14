const Comment = require("../models/Comment");
const Post = require("../models/Post");
const logger = require("../utils/logger");

/**
 * Timeline period patterns — maps regex patterns to human-readable labels.
 */
const TIMELINE_PATTERNS = [
  { regex: /\b(day\s*1|first\s*day)\b/i, label: "Day 1" },
  { regex: /\b(week\s*1|first\s*week)\b/i, label: "Week 1" },
  { regex: /\b(week\s*2|second\s*week)\b/i, label: "Week 2" },
  { regex: /\b(week\s*3|third\s*week)\b/i, label: "Week 3" },
  { regex: /\b(week\s*4|fourth\s*week|1\s*month|first\s*month)\b/i, label: "Month 1" },
  { regex: /\b(month\s*2|second\s*month|2\s*months)\b/i, label: "Month 2" },
  { regex: /\b(month\s*3|third\s*month|3\s*months)\b/i, label: "Month 3" },
  { regex: /\b(month\s*[4-6]|[4-6]\s*months)\b/i, label: "Month 4-6" },
  { regex: /\b(month\s*[7-9]|[7-9]\s*months)\b/i, label: "Month 7-9" },
  { regex: /\b(year|12\s*months|month\s*12)\b/i, label: "1 Year" },
];

/**
 * Common side-effect keywords to look for in comment text.
 */
const SYMPTOM_KEYWORDS = [
  "dry lips",
  "dry skin",
  "peeling",
  "breakout",
  "purging",
  "joint pain",
  "back pain",
  "fatigue",
  "headache",
  "nosebleed",
  "mood changes",
  "depression",
  "anxiety",
  "hair loss",
  "rash",
  "sun sensitivity",
  "nausea",
  "blurry vision",
];

/**
 * Build an aggregated recovery timeline for the given drug.
 *
 * @param {string} drugName - The drug to build a timeline for
 * @returns {Object} - { drug, timeline: [{ period, symptoms: [{ symptom, count }] }] }
 */
const getTimeline = async (drugName) => {
  // Find all posts for this drug
  const posts = await Post.find({ query_drug: drugName.toLowerCase() });
  const postIds = posts.map((p) => p.post_id);

  if (postIds.length === 0) {
    logger.warn(`No posts found for drug "${drugName}"`);
    return { drug: drugName, timeline: [] };
  }

  // Fetch all comments linked to those posts
  const comments = await Comment.find({ post_id: { $in: postIds } });

  // Build timeline buckets
  const timelineMap = {};

  for (const comment of comments) {
    const text = comment.text.toLowerCase();

    for (const { regex, label } of TIMELINE_PATTERNS) {
      if (regex.test(comment.text)) {
        if (!timelineMap[label]) {
          timelineMap[label] = {};
        }

        for (const symptom of SYMPTOM_KEYWORDS) {
          if (text.includes(symptom)) {
            timelineMap[label][symptom] = (timelineMap[label][symptom] || 0) + 1;
          }
        }
      }
    }
  }

  // Convert map to sorted array
  const periodOrder = TIMELINE_PATTERNS.map((p) => p.label);
  const timeline = Object.entries(timelineMap)
    .sort(([a], [b]) => periodOrder.indexOf(a) - periodOrder.indexOf(b))
    .map(([period, symptoms]) => ({
      period,
      symptoms: Object.entries(symptoms)
        .map(([symptom, count]) => ({ symptom, count }))
        .sort((a, b) => b.count - a.count),
    }));

  logger.info(`Timeline built for "${drugName}" — ${timeline.length} periods`);
  return { drug: drugName, timeline };
};

module.exports = { getTimeline };
