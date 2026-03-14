const { openfdaClient } = require('../config/openfda');
const { calculateCredibility } = require('./credibility.service');
const { analyzeClaim, verdictToScore } = require('./bsMeter.service');
const { getCache, setCache } = require('../utils/cache');
const { withRetry } = require('../utils/aiPatterns');

/**
 * Verifies a claim against OpenFDA and runs the BS Meter for NLI analysis.
 * Returns FDA match status, BS Meter verdict, and overall credibility score.
 */
const verifyClaim = async (drug, sideEffect, claimText) => {
  let fdaMatch = false;

  try {
    // 1. Validate inputs
    if (!drug || !sideEffect) {
       throw new Error('Both drug and side effect are required for verification.');
    }

    const cacheKey = `verify_${drug}_${sideEffect}`;
    const cached = getCache(cacheKey);
    if (cached) {
      console.log(`[Cache hit] Verify claim for drug: ${drug}, effect: ${sideEffect}`);
      return cached;
    }

    // 2. Query OpenFDA for direct adverse event match
    const queryStr = `patient.drug.medicinalproduct:"${drug}" AND patient.reaction.reactionmeddrapt:"${sideEffect}"`;
    
    try {
      const response = await withRetry(async () => {
        return await openfdaClient.get('/event.json', {
          params: {
            search: queryStr,
            limit: 1
          }
        });
      }, 3, 1000);

      if (response.data && response.data.results && response.data.results.length > 0) {
        fdaMatch = true;
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        fdaMatch = false;
      } else {
        console.error(`FDA API Error for ${drug} + ${sideEffect}:`, err.message);
        fdaMatch = false;
      }
    }

    // 3. Run the BS Meter (NLI fact-checking)
    const bsMeterClaimText = claimText || `I took ${drug} and experienced ${sideEffect}`;
    let bsMeterResult;
    try {
      bsMeterResult = await analyzeClaim(drug, sideEffect, bsMeterClaimText);
    } catch (err) {
      console.error(`[BS Meter] Analysis failed:`, err.message);
      bsMeterResult = {
        verdict: 'neutral',
        confidence: 0.5,
        fda_side_effects_found: [],
        fda_reports_exist: false,
        details: { error: err.message }
      };
    }

    // 4. Calculate credibility score with NLI integration
    const nliScore = verdictToScore(bsMeterResult.verdict);
    const redditFrequency = 0.8; // Mock - would come from DB aggregation
    const upvoteWeight = 0.5;    // Mock - would come from DB aggregation

    const score = calculateCredibility(fdaMatch, nliScore, redditFrequency, upvoteWeight);

    const result = {
      verified: fdaMatch,
      credibility_score: score,
      bs_meter: {
        verdict: bsMeterResult.verdict,
        confidence: bsMeterResult.confidence,
        fda_side_effects_found: bsMeterResult.fda_side_effects_found,
        fda_reports_exist: bsMeterResult.fda_reports_exist
      }
    };
    
    setCache(cacheKey, result);
    return result;

  } catch (error) {
    console.error(`Verification Error: ${error.message}`);
    throw error;
  }
};

module.exports = {
  verifyClaim
};
