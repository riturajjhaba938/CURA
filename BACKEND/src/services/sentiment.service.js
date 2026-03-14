const { sentimentModel } = require('../config/bytez');
const { getCache, setCache } = require('../utils/cache');
const { withRetry } = require('../utils/aiPatterns');

/**
 * Medical Sentiment & Severity Analysis Service
 * 
 * Analyzes patient narratives to understand:
 * - Overall sentiment (positive / negative / neutral)
 * - Severity level (mild / moderate / severe / critical)
 * - Recovery indicators (improving / stable / worsening)
 * 
 * Uses a medical-aware sentiment model that understands clinical context,
 * e.g., "I feel no pain" → positive (not negative despite the word "pain").
 */

/**
 * Analyzes the sentiment and severity of a medical narrative.
 * 
 * @param {string} text - The patient's narrative text
 * @returns {Object} { sentiment, severity, confidence, details }
 */
const analyzeSentiment = async (text) => {
  if (!text || typeof text !== 'string') {
    return { sentiment: 'neutral', severity: 'unknown', confidence: 0, details: {} };
  }

  const cacheKey = `sent_${text.substring(0, 80)}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log('[Sentiment] Cache hit');
    return cached;
  }

  console.log(`[Sentiment] Analyzing: "${text.substring(0, 80)}..."`);

  let modelOutput;
  try {
    modelOutput = await withRetry(async () => {
      const { error, output } = await sentimentModel.run(text);
      if (error) {
        throw new Error(`Sentiment model error: ${error}`);
      }
      return output;
    }, 3, 1000);
  } catch (err) {
    console.error('[Sentiment] Model failed:', err.message);
    // Fallback: keyword-based sentiment analysis
    return fallbackSentiment(text);
  }

  console.log('[Sentiment] Raw output:', JSON.stringify(modelOutput));

  const result = parseSentimentOutput(modelOutput, text);
  setCache(cacheKey, result);
  return result;
};

/**
 * Parses the sentiment model output into a structured result.
 * The model returns star ratings (1-5 stars) or label/score pairs.
 */
const parseSentimentOutput = (output, text) => {
  let scores = {};

  // Handle array of { label, score } format
  if (Array.isArray(output)) {
    // Could be nested array [[{label, score}...]]
    const items = Array.isArray(output[0]) ? output[0] : output;
    for (const item of items) {
      const label = (item.label || '').toLowerCase().trim();
      scores[label] = item.score || 0;
    }
  } else if (output && typeof output === 'object') {
    scores = output;
  }

  // Determine sentiment from star ratings (1-5 stars model)
  const starKeys = Object.keys(scores).filter(k => k.includes('star'));
  let sentiment, confidence, starRating;

  if (starKeys.length > 0) {
    // Find the highest scored star rating
    const best = starKeys.reduce((max, key) => 
      scores[key] > scores[max] ? key : max, starKeys[0]
    );
    
    const starNum = parseInt(best.replace(/[^0-9]/g, ''));
    starRating = starNum;
    confidence = scores[best];

    if (starNum <= 2) sentiment = 'negative';
    else if (starNum === 3) sentiment = 'neutral';
    else sentiment = 'positive';
  } else {
    // Generic label-based parsing
    const labels = Object.keys(scores);
    const best = labels.reduce((max, key) =>
      scores[key] > scores[max] ? key : max, labels[0] || 'neutral'
    );
    sentiment = best.includes('pos') ? 'positive' : best.includes('neg') ? 'negative' : 'neutral';
    confidence = scores[best] || 0.5;
    starRating = null;
  }

  // Determine severity from text keywords and sentiment
  const severity = determineSeverity(text, sentiment);

  // Determine recovery trajectory
  const recovery = determineRecovery(text);

  return {
    sentiment,
    severity: severity.level,
    confidence: Math.round(confidence * 100) / 100,
    star_rating: starRating,
    recovery_indicator: recovery,
    details: {
      severity_keywords: severity.keywords,
      scores
    }
  };
};

/**
 * Determines severity level based on medical keywords in the text.
 */
const determineSeverity = (text, sentiment) => {
  const lowerText = text.toLowerCase();
  const keywords = [];

  // Critical severity indicators
  const criticalTerms = ['emergency', 'hospitalized', 'life-threatening', 'nearly died', 'icu', 'anaphylax', 'seizure', 'cardiac arrest', 'stroke'];
  const severeTerms = ['severe', 'unbearable', 'extreme', 'terrible', 'worst', 'excruciating', 'debilitating', 'incapacitating', 'agonizing'];
  const moderateTerms = ['moderate', 'noticeable', 'significant', 'uncomfortable', 'persistent', 'bothersome', 'frequent'];
  const mildTerms = ['mild', 'slight', 'minor', 'barely', 'occasional', 'manageable', 'tolerable'];
  const positiveTerms = ['better', 'improved', 'recovered', 'resolved', 'no pain', 'feeling good', 'cleared up', 'went away'];

  for (const term of criticalTerms) {
    if (lowerText.includes(term)) keywords.push(term);
  }
  if (keywords.length > 0) return { level: 'critical', keywords };

  for (const term of severeTerms) {
    if (lowerText.includes(term)) keywords.push(term);
  }
  if (keywords.length > 0) return { level: 'severe', keywords };

  for (const term of positiveTerms) {
    if (lowerText.includes(term)) keywords.push(term);
  }
  if (keywords.length > 0) return { level: 'mild', keywords };

  for (const term of moderateTerms) {
    if (lowerText.includes(term)) keywords.push(term);
  }
  if (keywords.length > 0) return { level: 'moderate', keywords };

  for (const term of mildTerms) {
    if (lowerText.includes(term)) keywords.push(term);
  }
  if (keywords.length > 0) return { level: 'mild', keywords };

  // Default based on sentiment
  if (sentiment === 'negative') return { level: 'moderate', keywords: ['inferred from negative sentiment'] };
  return { level: 'mild', keywords: ['no severity indicators found'] };
};

/**
 * Determines recovery trajectory from text.
 */
const determineRecovery = (text) => {
  const lowerText = text.toLowerCase();

  const improvingTerms = ['getting better', 'improved', 'improving', 'recovering', 'cleared up', 'went away', 'subsided', 'feeling better', 'back to normal'];
  const worseningTerms = ['getting worse', 'worsening', 'deteriorating', 'escalating', 'spreading', 'not improving', 'still suffering'];
  const stableTerms = ['same', 'unchanged', 'stable', 'consistent', 'still have', 'ongoing'];

  for (const term of improvingTerms) {
    if (lowerText.includes(term)) return 'improving';
  }
  for (const term of worseningTerms) {
    if (lowerText.includes(term)) return 'worsening';
  }
  for (const term of stableTerms) {
    if (lowerText.includes(term)) return 'stable';
  }

  return 'unknown';
};

/**
 * Keyword-based fallback sentiment analysis when the AI model is unavailable.
 */
const fallbackSentiment = (text) => {
  const lowerText = text.toLowerCase();

  const negativeWords = ['pain', 'terrible', 'awful', 'worse', 'severe', 'hate', 'horrible', 'sick', 'suffering', 'miserable', 'died', 'emergency'];
  const positiveWords = ['better', 'great', 'improved', 'good', 'amazing', 'love', 'helped', 'cured', 'recovered', 'wonderful', 'no pain', 'relief'];

  let negScore = 0, posScore = 0;
  const keywords = [];

  for (const word of negativeWords) {
    if (lowerText.includes(word)) { negScore++; keywords.push(word); }
  }
  for (const word of positiveWords) {
    if (lowerText.includes(word)) { posScore++; keywords.push(word); }
  }

  // Check for negation patterns that flip meaning
  const negationPatterns = ['no pain', 'not bad', 'no side effects', 'without any', 'no issues'];
  for (const pattern of negationPatterns) {
    if (lowerText.includes(pattern)) { posScore += 2; }
  }

  let sentiment;
  if (posScore > negScore) sentiment = 'positive';
  else if (negScore > posScore) sentiment = 'negative';
  else sentiment = 'neutral';

  const severity = determineSeverity(text, sentiment);
  const recovery = determineRecovery(text);

  return {
    sentiment,
    severity: severity.level,
    confidence: 0.6,
    star_rating: null,
    recovery_indicator: recovery,
    details: {
      severity_keywords: severity.keywords,
      scores: { fallback: true, pos: posScore, neg: negScore }
    }
  };
};

module.exports = {
  analyzeSentiment
};
