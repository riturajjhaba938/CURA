const { olaMapsClient } = require('../config/olaMaps');
const { analyzeSentiment } = require('./sentiment.service');
const { getCache, setCache } = require('../utils/cache');
const { withRetry } = require('../utils/aiPatterns');

/**
 * Hospital & Clinic Finder Service (Ola Maps Version)
 * 
 * Uses Ola Maps API to find nearby hospitals, clinics, and healthcare facilities.
 * Features:
 * - Search by text query (e.g., "hospitals in Delhi")
 * - Filter by type: government, private, clinic
 * - AI-powered review analysis for best results
 * - Ranking based on ratings and sentiment
 */

/**
 * Searches for hospitals and clinics using Ola Maps.
 * 
 * @param {Object} params
 * @param {string} params.location - Location string (e.g., "Delhi", "Mumbai")
 * @param {string} params.type - Filter: "hospital", "clinic", "all"
 * @param {string} params.category - Filter: "government", "private", "all"
 * @param {number} params.minRating - Minimum rating filter
 * @returns {Object} { results, total }
 */
const searchHospitalsOla = async (params) => {
  const {
    location,
    type = 'all',
    category = 'all',
    minRating = 0,
    analyzeReviews = true
  } = params;

  if (!location) {
    throw new Error('location is required');
  }

  const cacheKey = `hosp_ola_${location}_${type}_${category}_${minRating}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  console.log(`[HospitalFinderOla] Searching in ${location} for type: ${type}`);

  // Step 1: Text Search using Ola Maps
  // Ola Maps Search Endpoint: /places/v1/search
  const query = `${type === 'all' ? 'hospitals and clinics' : type + 's'} in ${location}`;
  
  let response;
  try {
    response = await withRetry(async () => {
      return await olaMapsClient.get('/places/v1/search', {
        params: { text: query }
      });
    }, 2, 1000);
  } catch (err) {
    console.error(`[HospitalFinderOla] Search failed:`, err.message);
    throw new Error('Ola Maps search failed. Please verify API key.');
  }

  const places = response.data.predictions || [];
  console.log(`[HospitalFinderOla] Found ${places.length} results`);

  // Step 2: Get details for top results to filter/analyze
  // Ola Maps Details Endpoint: /places/v1/details
  const detailed = [];
  const topPlaces = places.slice(0, 5); // Limit for performance/credits

  for (const place of topPlaces) {
    try {
      const detailsResp = await olaMapsClient.get('/places/v1/details', {
        params: { place_id: place.place_id }
      });
      const p = detailsResp.data.result || {};

      const enriched = {
        name: p.name || place.description,
        address: p.formatted_address || place.description,
        rating: p.rating || 0,
        total_reviews: p.user_ratings_total || 0,
        place_id: place.place_id,
        category: categorizePlace(p.name || ''),
        price_level: p.price_level || null,
        reviews: p.reviews || []
      };

      // Filter by rating
      if (enriched.rating < minRating) continue;

      // Filter by category (Govt/Pvt)
      if (category !== 'all' && enriched.category !== category) continue;

      // Step 3: Analyze reviews with AI sentiment
      if (analyzeReviews && enriched.reviews.length > 0) {
        enriched.ai_sentiment = await analyzeReviewsBatch(enriched.reviews);
        enriched.recommendation = generateRecommendation(enriched.ai_sentiment);
      }

      detailed.push(enriched);
    } catch (err) {
      console.error(`[HospitalFinderOla] Failed to get details for ${place.place_id}:`, err.message);
    }
  }

  // Sort by rating (top results)
  detailed.sort((a, b) => b.rating - a.rating);

  const result = {
    results: detailed,
    total: detailed.length,
    provider: 'Ola Maps'
  };

  setCache(cacheKey, result);
  return result;
};

/**
 * Categorizes a hospital as government or private.
 */
const categorizePlace = (name) => {
  const lower = name.toLowerCase();
  const govtKeywords = ['government', 'govt', 'district', 'municipal', 'civil', 'public', 'state', 'national', 'panchayat'];
  
  if (govtKeywords.some(k => lower.includes(k))) return 'government';
  return 'private';
};

/**
 * Batch analyzes reviews using medical sentiment model.
 */
const analyzeReviewsBatch = async (reviews) => {
  const sentinelResults = [];
  for (const r of reviews.slice(0, 3)) {
    try {
      const result = await analyzeSentiment(r.text || '');
      sentinelResults.push(result);
    } catch (err) {
      console.error('[HospitalFinderOla] Review analysis failed:', err.message);
    }
  }
  return sentinelResults;
};

/**
 * Generates recommendation based on sentiment analysis.
 */
const generateRecommendation = (sentiments) => {
  if (sentiments.length === 0) return 'No enough patient feedback for AI analysis.';
  const posCount = sentiments.filter(s => s.sentiment === 'positive').length;
  if (posCount >= sentiments.length * 0.7) return 'Highly Recommended based on patient experiences.';
  if (posCount >= sentiments.length * 0.4) return 'Recommended for routine checkups.';
  return 'Mixed feedback - Proceed with caution.';
};

module.exports = {
  searchHospitalsOla
};
