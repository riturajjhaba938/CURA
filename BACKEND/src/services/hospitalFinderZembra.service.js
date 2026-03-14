const { zembraClient } = require('../config/zembra');
const { analyzeSentiment } = require('./sentiment.service');
const { getCache, setCache } = require('../utils/cache');
const { withRetry } = require('../utils/aiPatterns');

/**
 * Hospital & Clinic Finder Service (Zembra Version)
 * 
 * Uses Zembra.io API to find healthcare facilities and analyze reviews.
 * Features:
 * - Search by keyword and location
 * - Filter by type: government, private, clinic
 * - AI-powered review analysis for best results
 * - Ranking based on ratings and sentiment
 */

/**
 * Searches for hospitals and clinics using Zembra.
 * 
 * @param {Object} params
 * @param {string} params.location - Location string (e.g., "Delhi, India")
 * @param {string} params.type - Filter: "hospital", "clinic", "all"
 * @param {string} params.category - Filter: "government", "private", "all"
 * @param {number} params.minRating - Minimum rating filter
 * @returns {Object} { results, total }
 */
const searchHospitalsZembra = async (params) => {
  const {
    location,
    type = 'all',
    category = 'all',
    minRating = 0,
    analyzeReviews = true
  } = params;

  if (!location) {
    throw new Error('location is required (e.g., City, State, Country)');
  }

  const cacheKey = `hosp_zembra_${location}_${type}_${category}_${minRating}`;
  const cached = getCache(cacheKey);
  if (cached) return cached;

  const query = `${type === 'all' ? 'hospitals' : type} in ${location}`;
  console.log(`[HospitalFinderZembra] Searching for "${query}"`);

  let response;
  try {
    response = await withRetry(async () => {
      return await zembraClient.get('/listing/find', {
        params: { query, location },
        timeout: 5000 // Shorter timeout for faster fallback
      });
    }, 1, 1000); // Fewer retries for the demo
  } catch (err) {
    console.warn(`[HospitalFinderZembra] Search failed: ${err.message}. Using demo fallback data.`);
    return getMockResults(location, type, category, minRating, analyzeReviews);
  }

  const listings = Array.isArray(response.data) ? response.data : 
                   (response.data.results ? response.data.results : []);
  
  console.log(`[HospitalFinderZembra] Found ${listings.length} candidate results`);

  // Step 3: Process and Analyze Results
  const detailed = [];
  const topListings = listings.slice(0, 10);
  let aiProcessedCount = 0;
  const MAX_AI_RESULTS = 3; // Limit AI intensive analysis to top 3

  for (const item of topListings) {
    try {
      const enriched = {
        name: item.name || 'Unknown Facility',
        address: item.address || item.formatted_address || location,
        rating: item.rating || 0,
        total_reviews: item.reviews_count || item.user_ratings_total || 0,
        place_id: item.place_id || item.id,
        category: categorizeFacility(item.name || ''),
        price_level: item.price_level || null,
        reviews: []
      };

      // Basic Filters
      if (enriched.rating < minRating) continue;
      if (category !== 'all' && enriched.category !== category) continue;

      // Token Optimization Strategy:
      // 1. Skip AI for very highly rated established facilities (they are already 'verified')
      // 2. Filter for only descriptive reviews
      // 3. Hard limit on total AI calls
      
      let reviewsToAnalyze = (item.reviews || [])
        .filter(r => (r.text || r.content || '').length > 30) // Only descriptive reviews
        .slice(0, 3);

      const isEstablishedHighQuality = enriched.rating >= 4.5 && enriched.total_reviews > 100;

      if (analyzeReviews && !isEstablishedHighQuality && aiProcessedCount < MAX_AI_RESULTS && reviewsToAnalyze.length > 0) {
        enriched.reviews = reviewsToAnalyze.map(r => ({
          author: r.author || r.user_name || 'Anonymous',
          text: r.text || r.content || '',
          rating: r.rating || 5
        }));
        
        console.log(`[HospitalFinderZembra] AI Analyzing reviews for ${enriched.name}...`);
        enriched.ai_sentiment = await analyzeReviewsBatch(enriched.reviews);
        enriched.recommendation = generateRecommendation(enriched.ai_sentiment);
        aiProcessedCount++;
      } else if (reviewsToAnalyze.length > 0) {
        // Just return the reviews without AI analysis for some results to save tokens
        enriched.reviews = reviewsToAnalyze.slice(0, 3).map(r => ({
          author: r.author || r.user_name || 'Anonymous',
          text: r.text || r.content || '',
          rating: r.rating || 5
        }));
        if (isEstablishedHighQuality) {
          enriched.recommendation = "Highly trusted facility based on long-term patient ratings.";
        }
      }

      detailed.push(enriched);
    } catch (err) {
      console.error(`[HospitalFinderZembra] Error processing listing:`, err.message);
    }
  }

  // Final Rank by combined rating and sentiment
  detailed.sort((a, b) => {
    const scoreA = (a.rating * 0.7) + (a.ai_sentiment ? (a.ai_sentiment.filter(s => s.sentiment === 'positive').length / a.ai_sentiment.length) * 1.5 : 0);
    const scoreB = (b.rating * 0.7) + (b.ai_sentiment ? (b.ai_sentiment.filter(s => s.sentiment === 'positive').length / b.ai_sentiment.length) * 1.5 : 0);
    return scoreB - scoreA;
  });

  const result = {
    results: detailed,
    total: detailed.length,
    provider: 'Zembra.io',
    ai_optimized: true,
    tokens_saved: `${(detailed.length - aiProcessedCount) * 3} calls estimated`
  };

  setCache(cacheKey, result);
  return result;
};

/**
 * Categorizes a facility.
 */
const categorizeFacility = (name) => {
  const lower = name.toLowerCase();
  const govtKeywords = ['government', 'govt', 'district', 'municipal', 'civil', 'public', 'state', 'national', 'aiims', 'phc', 'chc', 'civil hospital'];
  if (govtKeywords.some(k => lower.includes(k))) return 'government';
  return 'private';
};

/**
 * Batch analyzes reviews using medical sentiment model.
 */
const analyzeReviewsBatch = async (reviews) => {
  const analyzed = [];
  for (const r of reviews) {
    if (!r.text) continue;
    try {
      const result = await analyzeSentiment(r.text);
      analyzed.push(result);
    } catch (err) {
      // Fallback or ignore
    }
  }
  return analyzed;
};

/**
 * Generates recommendation summary.
 */
const generateRecommendation = (sentiments) => {
  if (sentiments.length === 0) return 'Insufficient data for AI recommendation.';
  const pos = sentiments.filter(s => s.sentiment === 'positive').length;
  const ratio = pos / sentiments.length;

  if (ratio >= 0.8) return 'Excellent: High patient satisfaction and recovery indicators.';
  if (ratio >= 0.5) return 'Good: Mostly positive feedback with reliable service.';
  if (ratio >= 0.3) return 'Average: Mixed patient experiences reported.';
  return 'Below Average: Significant negative feedback detected.';
};

/**
 * Mock data generator for demo purposes when API is unreachable.
 */
const getMockResults = async (location, type, category, minRating, analyzeReviews) => {
  const city = location.split(',')[0].trim();
  const isJaipur = city.toLowerCase() === 'jaipur';

  const mockFacilities = isJaipur ? [
    { name: `Jaipur Healing Clinic`, rating: 4.6, reviews_count: 120, category: 'private', address: `Adarsh Nagar, Jaipur` },
    { name: `Pink City Dental & Medical`, rating: 4.9, reviews_count: 45, category: 'private', address: `Malviya Nagar, Jaipur` },
    { name: `Govt Dispensary Jaipur`, rating: 4.1, reviews_count: 850, category: 'government', address: `C-Scheme, Jaipur` },
    { name: `SDMH Hospital, Jaipur`, rating: 4.5, reviews_count: 1500, category: 'private', address: `Tonk Road, Jaipur` },
    { name: `Jaipur Clinic Center`, rating: 4.3, reviews_count: 90, category: 'private', address: `Vaishali Nagar, Jaipur` }
  ] : [
    { name: `Apollo Hospital, ${city}`, rating: 4.8, reviews_count: 1250, category: 'private', address: `Near Main Road, ${city}` },
    { name: `Civil Hospital (Govt), ${city}`, rating: 4.2, reviews_count: 3100, category: 'government', address: `District Center, ${city}` },
    { name: `AIIMS Campus, ${city}`, rating: 4.9, reviews_count: 5600, category: 'government', address: `Health Enclave, ${city}` },
    { name: `City Clinic & Diagnostics`, rating: 4.5, reviews_count: 420, category: 'private', address: `Station Road, ${city}` },
    { name: `Max Super Speciality`, rating: 4.7, reviews_count: 980, category: 'private', address: `Cyber Park, ${city}` }
  ];

  let filtered = mockFacilities.filter(f => {
    const nameLow = f.name.toLowerCase();
    if (type !== 'all') {
      if (type === 'clinic' && !nameLow.includes('clinic') && !nameLow.includes('dispensary')) return false;
      if (type === 'hospital' && !nameLow.includes('hospital')) return false;
    }
    if (category !== 'all' && f.category !== category) return false;
    if (f.rating < minRating) return false;
    return true;
  });

  const detailed = [];
  let aiProcessedCount = 0;
  for (const f of filtered) {
    const isEstablished = f.rating >= 4.5 && f.reviews_count > 100;
    const enriched = {
      ...f,
      reviews: [
        { author: 'Rahul S.', text: 'Excellent care and fast response.', rating: 5 },
        { author: 'Anjali M.', text: 'The staff was very helpful but the wait time was long.', rating: 4 },
        { author: 'Dr. Karan', text: 'Top tier medical equipment available here.', rating: 5 }
      ]
    };

    if (analyzeReviews && !isEstablished && aiProcessedCount < 3) {
      enriched.ai_sentiment = await analyzeReviewsBatch(enriched.reviews);
      enriched.recommendation = generateRecommendation(enriched.ai_sentiment);
      aiProcessedCount++;
    } else if (isEstablished) {
      enriched.recommendation = "Highly trusted facility based on long-term patient feedback.";
    }
    detailed.push(enriched);
  }

  return {
    results: detailed,
    total: detailed.length,
    provider: 'Zembra.io (Demo Fallback)',
    ai_optimized: true,
    tokens_saved: `${(detailed.length - aiProcessedCount) * 3} calls estimated`
  };
};

module.exports = {
  searchHospitalsZembra
};
