/**
 * Traceability Service - prevens AI hallucinations by tagging insights with specific source IDs.
 */

const tagInsightWithSource = (insight, sourceType, sourceId) => {
  return {
    ...insight,
    traceability: {
      source_type: sourceType, // 'Reddit' or 'FDA'
      source_id: sourceId,
      verified_at: new Date().toISOString()
    }
  };
};

const getTraceData = async (insightId) => {
  // Mock logic to fetch trace data for an insight
  return {
    insight_id: insightId,
    source_url: `https://www.reddit.com/comments/${insightId}`,
    raw_data_snapshot: "I took 20mg of Accutane and had dry lips.",
    trust_score: 0.85
  };
};

module.exports = {
  tagInsightWithSource,
  getTraceData
};
