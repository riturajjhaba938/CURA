const { nliModel } = require('../config/bytez');
const { openfdaClient } = require('../config/openfda');
const { getCache, setCache } = require('../utils/cache');
const { withRetry } = require('../utils/aiPatterns');

/**
 * BS Meter Service
 * Uses Natural Language Inference (NLI) to fact-check Reddit drug claims
 * against official FDA adverse event data.
 * 
 * Returns: entailment (claim matches FDA data), contradiction (claim conflicts),
 * or neutral (inconclusive).
 */

/**
 * Fetches known side effects for a drug from the OpenFDA adverse events database.
 * Returns a list of reported reactions.
 */
const fetchFdaSideEffects = async (drug) => {
  try {
    const response = await withRetry(async () => {
      return await openfdaClient.get('/event.json', {
        params: {
          search: `patient.drug.medicinalproduct:"${drug}"`,
          limit: 5
        }
      });
    }, 3, 1000);

    if (!response.data || !response.data.results) return [];

    // Extract unique side effects from FDA results
    const sideEffects = new Set();
    for (const result of response.data.results) {
      if (result.patient && result.patient.reaction) {
        for (const reaction of result.patient.reaction) {
          if (reaction.reactionmeddrapt) {
            sideEffects.add(reaction.reactionmeddrapt.toLowerCase());
          }
        }
      }
    }

    return [...sideEffects];
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return []; // No FDA data found for this drug
    }
    console.error(`[BS Meter] FDA lookup failed for ${drug}:`, err.message);
    return [];
  }
};

/**
 * Runs the BS Meter analysis.
 * 
 * @param {string} drug - The drug name (e.g., "metformin")
 * @param {string} sideEffect - The claimed side effect (e.g., "nausea")
 * @param {string} claimText - The full Reddit claim text
 * @returns {Object} { verdict, confidence, fdaSideEffects, details }
 */
const analyzeClaim = async (drug, sideEffect, claimText) => {
  const cacheKey = `bs_${drug}_${sideEffect}_${claimText.substring(0, 50)}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log(`[Cache hit] BS Meter for ${drug}`);
    return cached;
  }

  console.log(`[BS Meter] Analyzing claim: "${claimText}" for drug: ${drug}`);

  // Step 1: Get known side effects from FDA
  const fdaSideEffects = await fetchFdaSideEffects(drug);
  console.log(`[BS Meter] FDA side effects for ${drug}:`, fdaSideEffects.slice(0, 10));

  // Step 2: Build the premise-hypothesis pair for NLI
  let premise;
  if (fdaSideEffects.length > 0) {
    premise = `The drug ${drug} has reported adverse effects including: ${fdaSideEffects.join(', ')}.`;
  } else {
    premise = `No adverse event reports were found for the drug ${drug} in the FDA database.`;
  }

  const hypothesis = claimText || `${drug} causes ${sideEffect}`;

  console.log(`[BS Meter] Premise: "${premise.substring(0, 100)}..."`);
  console.log(`[BS Meter] Hypothesis: "${hypothesis}"`);

  // Step 3: Run NLI model via Bytez
  let nliResult;
  try {
    nliResult = await withRetry(async () => {
      const { error, output } = await nliModel.run([premise, hypothesis]);
      if (error) {
        throw new Error(`NLI model error: ${error}`);
      }
      return output;
    }, 3, 1000);
  } catch (err) {
    console.error(`[BS Meter] NLI model failed:`, err.message);
    // Fallback: use simple string matching against FDA side effects
    const directMatch = fdaSideEffects.some(effect => 
      effect.includes(sideEffect.toLowerCase()) || sideEffect.toLowerCase().includes(effect)
    );
    
    nliResult = {
      verdict: directMatch ? 'entailment' : 'neutral',
      confidence: directMatch ? 0.7 : 0.5,
      fallback: true
    };
  }

  console.log(`[BS Meter] Raw NLI output:`, JSON.stringify(nliResult));

  // Step 4: Parse the NLI result
  const parsed = parseNliOutput(nliResult, fdaSideEffects, sideEffect);

  const result = {
    verdict: parsed.verdict,
    confidence: parsed.confidence,
    fda_side_effects_found: fdaSideEffects.slice(0, 10),
    fda_reports_exist: fdaSideEffects.length > 0,
    details: {
      premise: premise.substring(0, 200),
      hypothesis: hypothesis,
      raw_scores: parsed.scores
    }
  };

  setCache(cacheKey, result);
  return result;
};

/**
 * Parses the NLI model output into a structured verdict.
 * The cross-encoder NLI model typically returns label scores.
 */
const parseNliOutput = (nliOutput, fdaSideEffects, sideEffect) => {
  // If we used the fallback
  if (nliOutput && nliOutput.fallback) {
    return {
      verdict: nliOutput.verdict,
      confidence: nliOutput.confidence,
      scores: { fallback: true }
    };
  }

  // The NLI model output may be in various formats:
  // Array of { label, score } or a single object
  let scores = { entailment: 0, contradiction: 0, neutral: 0 };

  if (Array.isArray(nliOutput)) {
    for (const item of nliOutput) {
      const label = (item.label || '').toLowerCase();
      if (label.includes('entail')) scores.entailment = item.score || 0;
      else if (label.includes('contra')) scores.contradiction = item.score || 0;
      else if (label.includes('neutral')) scores.neutral = item.score || 0;
    }
  } else if (nliOutput && typeof nliOutput === 'object') {
    // Might be a flat object with scores
    scores.entailment = nliOutput.entailment || nliOutput.ENTAILMENT || 0;
    scores.contradiction = nliOutput.contradiction || nliOutput.CONTRADICTION || 0;
    scores.neutral = nliOutput.neutral || nliOutput.NEUTRAL || 0;
  }

  // Determine the winning verdict
  const maxEntry = Object.entries(scores).reduce((max, [label, score]) => 
    score > max[1] ? [label, score] : max, ['neutral', 0]
  );

  // Boost entailment if the side effect directly appears in FDA data
  const directFdaMatch = fdaSideEffects.some(effect =>
    effect.includes(sideEffect.toLowerCase()) || sideEffect.toLowerCase().includes(effect)
  );

  let verdict = maxEntry[0];
  let confidence = maxEntry[1];

  if (directFdaMatch && verdict !== 'entailment') {
    // FDA data directly supports the claim, override if NLI was uncertain
    if (confidence < 0.6) {
      verdict = 'entailment';
      confidence = 0.75;
    }
  }

  return { verdict, confidence: Math.round(confidence * 100) / 100, scores };
};

/**
 * Converts a BS Meter verdict to a numeric score for the credibility formula.
 * entailment = 1.0, neutral = 0.5, contradiction = 0.0
 */
const verdictToScore = (verdict) => {
  switch (verdict) {
    case 'entailment': return 1.0;
    case 'neutral': return 0.5;
    case 'contradiction': return 0.0;
    default: return 0.5;
  }
};

module.exports = {
  analyzeClaim,
  verdictToScore
};
