/**
 * Calculates a credibility score for a claim.
 * Updated formula with NLI (BS Meter) integration:
 * score = 0.4 * FDA_match + 0.3 * NLI_score + 0.2 * Reddit_frequency + 0.1 * upvote_weight
 */

const calculateCredibility = (fdaMatch, nliScore, redditFrequency, upvoteWeight) => {
  // fdaMatch: boolean or 1/0
  const fdaValue = fdaMatch ? 1 : 0;
  
  // nliScore: 0 to 1 value from the BS Meter (entailment=1, neutral=0.5, contradiction=0)
  const nliValue = Math.min(Math.max(nliScore || 0.5, 0), 1);

  // redditFrequency: normalized 0 to 1 value based on how often the side effect is discussed
  const frequencyValue = Math.min(Math.max(redditFrequency, 0), 1); 
  
  // upvoteWeight: normalized 0 to 1 value representing community consensus
  const upvoteValue = Math.min(Math.max(upvoteWeight, 0), 1);
  
  let score = (0.4 * fdaValue) + (0.3 * nliValue) + (0.2 * frequencyValue) + (0.1 * upvoteValue);
  
  // Ensure score is within 0-1 bounds and rounded to 2 decimal places
  score = Math.round(score * 100) / 100;
  
  return score;
};

module.exports = {
  calculateCredibility
};
