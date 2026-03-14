const Comment = require('../models/Comment');
const Insight = require('../models/Insight');
const { extractEntities } = require('./entityExtraction.service');
const logger = require('../utils/logger');

/**
 * Post-Scrape Pipeline
 *
 * After the Python scraper saves Posts + Comments to MongoDB, this service:
 * 1. Fetches all comments for the given drug that don't have Insights yet
 * 2. Runs NER extraction on each comment
 * 3. Saves the extracted entities as Insight documents
 *
 * This bridges the gap between raw scraped data and structured medical insights.
 */

/**
 * Processes all un-analyzed comments for a given drug.
 *
 * @param {string} drugName - The drug that was just scraped
 * @returns {Object} { processed, skipped, errors, insights }
 */
const processScrapedComments = async (drugName) => {
  const startTime = Date.now();
  logger.info(`[Pipeline] Starting insight extraction for drug: "${drugName}"`);

  // 1. Get all post_ids for this drug
  const Post = require('../models/Post');
  const posts = await Post.find({ query_drug: drugName.toLowerCase() });
  const postIds = posts.map((p) => p.post_id);

  if (postIds.length === 0) {
    logger.warn(`[Pipeline] No posts found for drug "${drugName}"`);
    return { processed: 0, skipped: 0, errors: 0, insights: [] };
  }

  // 2. Get all comments for those posts
  const allComments = await Comment.find({ post_id: { $in: postIds } });
  logger.info(`[Pipeline] Found ${allComments.length} comments across ${postIds.length} posts`);

  // 3. Find which comments already have Insights (skip duplicates)
  const existingInsights = await Insight.find({
    comment_id: { $in: allComments.map((c) => c.comment_id) },
  }).select('comment_id');
  const alreadyProcessed = new Set(existingInsights.map((i) => i.comment_id));

  const newComments = allComments.filter((c) => !alreadyProcessed.has(c.comment_id));
  logger.info(`[Pipeline] ${newComments.length} new comments to process (${alreadyProcessed.size} already done)`);

  // 4. Process each comment through NER
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  const savedInsights = [];

  // Process in batches of 5 to avoid overwhelming the AI model
  const BATCH_SIZE = 5;
  for (let i = 0; i < newComments.length; i += BATCH_SIZE) {
    const batch = newComments.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.allSettled(
      batch.map(async (comment) => {
        try {
          // Run NER on the comment text directly (faster than re-querying DB)
          const entities = await extractEntities(comment.text, true);

          // Skip if NER found nothing useful
          if (!entities.drug && !entities.side_effect) {
            skipped++;
            return null;
          }

          // Save as an Insight document
          const insight = await Insight.findOneAndUpdate(
            { comment_id: comment.comment_id },
            {
              comment_id: comment.comment_id,
              drug: entities.drug || drugName,
              side_effect: entities.side_effect || '',
              dosage: entities.dosage || '',
              timeline_marker: entities.timeline_marker || '',
              credibility_score: 0, // Will be calculated by verification service later
            },
            { upsert: true, new: true }
          );

          processed++;
          return insight;
        } catch (err) {
          errors++;
          console.error(`[Pipeline] Error processing comment ${comment.comment_id}: ${err.message}`);
          return null;
        }
      })
    );

    // Collect successful results
    for (const result of batchResults) {
      if (result.status === 'fulfilled' && result.value) {
        savedInsights.push(result.value);
      }
    }

    // Log progress
    const total = Math.min(i + BATCH_SIZE, newComments.length);
    logger.info(`[Pipeline] Progress: ${total}/${newComments.length} comments processed`);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  logger.info(`[Pipeline] Done in ${elapsed}s — processed: ${processed}, skipped: ${skipped}, errors: ${errors}`);

  return {
    processed,
    skipped,
    errors,
    total_comments: allComments.length,
    already_analyzed: alreadyProcessed.size,
    insights: savedInsights.slice(0, 20), // Return first 20 for the API response
    elapsed_seconds: parseFloat(elapsed),
  };
};

module.exports = {
  processScrapedComments,
};
