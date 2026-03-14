const { googlePlacesClient } = require('../config/googlePlaces');
const { analyzeSentiment } = require('./sentiment.service');
const { getCache, setCache } = require('../utils/cache');
const { withRetry } = require('../utils/aiPatterns');

/**
 * Hospital & Clinic Finder Service
 * 
 * Uses Google Places API to find nearby hospitals, clinics, and healthcare facilities.
 * Features:
 * - Search by location (lat/lng or text query)
 * - Filter by type: government, private, clinic
 * - Filter by price level
 * - Filter by minimum rating
 * - AI-powered review analysis using sentiment model
 * - Ranks results by combined score (rating + review sentiment)
 */

/**
 * Searches for hospitals and clinics near a location.
 * 
 * @param {Object} params
 * @param {string} params.location - Lat,Lng (e.g., "28.6139,77.2090") or text query
 * @param {number} params.radius - Search radius in meters (default 5000)
 * @param {string} params.type - Filter: "hospital", "clinic", "all" (default "all")
 * @param {string} params.category - Filter: "government", "private", "all" (default "all")
 * @param {number} params.minRating - Minimum rating filter (0-5)
 * @param {number} params.maxPrice - Max price level (0-4, Google's scale)
 * @param {boolean} params.analyzeReviews - Whether to run AI analysis on reviews
 * @returns {Object} { results, total, filters_applied }
 */
const searchHospitals = async (params) => {
  const {
    location,
    radius = 5000,
    type = 'all',
    category = 'all',
    minRating = 0,
    maxPrice = 4,
    analyzeReviews = true
  } = params;

  if (!location) {
    throw new Error('location is required (lat,lng or text query)');
  }

  const cacheKey = `hosp_${location}_${radius}_${type}_${category}_${minRating}_${maxPrice}`;
  const cached = getCache(cacheKey);
  if (cached) {
    console.log('[HospitalFinder] Cache hit');
    return cached;
  }

  console.log(`[HospitalFinder] Searching near ${location}, radius: ${radius}m, type: ${type}`);

  // Step 1: Search for hospitals and clinics using Google Places
  let places = [];
  const searchTypes = getSearchTypes(type);

  for (const placeType of searchTypes) {
    try {
      const results = await searchPlaces(location, radius, placeType);
      places = places.concat(results);
    } catch (err) {
      console.error(`[HospitalFinder] Search failed for type ${placeType}:`, err.message);
    }
  }

  // Remove duplicates by place_id
  const uniquePlaces = [...new Map(places.map(p => [p.place_id, p])).values()];
  console.log(`[HospitalFinder] Found ${uniquePlaces.length} unique places`);

  // Step 2: Apply filters
  let filtered = uniquePlaces.filter(place => {
    // Rating filter
    if (place.rating && place.rating < minRating) return false;
    // Price filter
    if (place.price_level !== undefined && place.price_level > maxPrice) return false;
    return true;
  });

  // Step 3: Categorize as government/private
  filtered = filtered.map(place => ({
    ...place,
    category: categorizePlace(place)
  }));

  // Apply category filter
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }

  // Step 4: Get detailed info + reviews for top results
  const topPlaces = filtered.slice(0, 10);
  const detailed = [];

  for (const place of topPlaces) {
    try {
      const details = await getPlaceDetails(place.place_id, place.reviews_raw);
      const enriched = {
        name: place.name,
        address: details.formatted_address || place.vicinity,
        phone: details.formatted_phone_number || null,
        website: details.website || null,
        rating: place.rating || null,
        total_reviews: place.user_ratings_total || 0,
        price_level: place.price_level ?? null,
        category: place.category,
        open_now: place.opening_hours?.open_now ?? null,
        location: place.geometry?.location || null,
        place_id: place.place_id,
        reviews: []
      };

      // Step 5: Analyze reviews with AI sentiment
      if (details.reviews && details.reviews.length > 0 && analyzeReviews) {
        enriched.reviews = await analyzeReviewsBatch(details.reviews.slice(0, 5));
        enriched.review_summary = summarizeReviews(enriched.reviews);
      } else if (details.reviews) {
        enriched.reviews = details.reviews.slice(0, 5).map(r => ({
          author: r.author_name,
          rating: r.rating,
          text: r.text,
          time: r.relative_time_description
        }));
      }

      // Calculate a combined score for ranking
      enriched.combined_score = calculateCombinedScore(enriched);

      detailed.push(enriched);
    } catch (err) {
      console.error(`[HospitalFinder] Failed to get details for ${place.name}:`, err.message);
      detailed.push({
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        category: place.category,
        total_reviews: place.user_ratings_total || 0,
        combined_score: (place.rating || 0) / 5
      });
    }
  }

  // Sort by combined score (best first)
  detailed.sort((a, b) => (b.combined_score || 0) - (a.combined_score || 0));

  const result = {
    results: detailed,
    total: detailed.length,
    total_found: uniquePlaces.length,
    filters_applied: {
      location,
      radius,
      type,
      category,
      min_rating: minRating,
      max_price: maxPrice,
      reviews_analyzed: analyzeReviews
    }
  };

  setCache(cacheKey, result);
  return result;
};

/**
 * Searches Google Places API (New) for places near a location.
 * Uses POST /v1/places:searchText
 */
const searchPlaces = async (location, radius, placeType) => {
  const isCoords = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location.replace(/\s/g, ''));
  const typeLabel = placeType === 'doctor' ? 'clinics' : placeType === 'health' ? 'healthcare centers' : 'hospitals';

  const requestBody = {
    textQuery: isCoords ? `${typeLabel}` : `${typeLabel} in ${location}`,
    maxResultCount: 20
  };

  // Add location bias for coordinate searches
  if (isCoords) {
    const [lat, lng] = location.replace(/\s/g, '').split(',').map(Number);
    requestBody.locationBias = {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: radius || 5000
      }
    };
  }

  const response = await withRetry(async () => {
    return await googlePlacesClient.post('/places:searchText', requestBody, {
      headers: {
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.priceLevel,places.types,places.location,places.currentOpeningHours,places.reviews'
      }
    });
  }, 2, 1000);

  if (response.data && response.data.places) {
    // Map new API format to a consistent internal format
    return response.data.places.map(p => ({
      place_id: p.id,
      name: p.displayName?.text || '',
      vicinity: p.formattedAddress || '',
      formatted_address: p.formattedAddress || '',
      rating: p.rating || null,
      user_ratings_total: p.userRatingCount || 0,
      price_level: parsePriceLevel(p.priceLevel),
      types: p.types || [],
      geometry: { location: p.location ? { lat: p.location.latitude, lng: p.location.longitude } : null },
      opening_hours: { open_now: p.currentOpeningHours?.openNow ?? null },
      reviews_raw: p.reviews || []
    }));
  }
  return [];
};

/**
 * Parses the new API price level enum to a number.
 */
const parsePriceLevel = (level) => {
  if (!level) return null;
  const map = {
    'PRICE_LEVEL_FREE': 0,
    'PRICE_LEVEL_INEXPENSIVE': 1,
    'PRICE_LEVEL_MODERATE': 2,
    'PRICE_LEVEL_EXPENSIVE': 3,
    'PRICE_LEVEL_VERY_EXPENSIVE': 4
  };
  return map[level] ?? null;
};

/**
 * Gets detailed info for a place.
 * The new API returns reviews in the text search itself when requested,
 * so we use the data we already have, or fetch via GET /v1/places/{id}
 */
const getPlaceDetails = async (placeId, existingReviews) => {
  // If we already have reviews from the search response, use them
  if (existingReviews && existingReviews.length > 0) {
    return {
      reviews: existingReviews.map(r => ({
        author_name: r.authorAttribution?.displayName || 'Anonymous',
        rating: r.rating || 0,
        text: r.text?.text || r.originalText?.text || '',
        relative_time_description: r.relativePublishTimeDescription || ''
      }))
    };
  }

  // Otherwise fetch details
  try {
    const response = await withRetry(async () => {
      return await googlePlacesClient.get(`/places/${placeId}`, {
        headers: {
          'X-Goog-FieldMask': 'reviews,websiteUri,nationalPhoneNumber'
        }
      });
    }, 2, 1000);

    const result = response.data || {};
    return {
      website: result.websiteUri || null,
      formatted_phone_number: result.nationalPhoneNumber || null,
      reviews: (result.reviews || []).map(r => ({
        author_name: r.authorAttribution?.displayName || 'Anonymous',
        rating: r.rating || 0,
        text: r.text?.text || r.originalText?.text || '',
        relative_time_description: r.relativePublishTimeDescription || ''
      }))
    };
  } catch (err) {
    console.error(`[HospitalFinder] Details fetch failed for ${placeId}:`, err.message);
    return {};
  }
};

/**
 * Returns Google Place types to search based on user filter.
 */
const getSearchTypes = (type) => {
  switch (type) {
    case 'hospital': return ['hospital'];
    case 'clinic': return ['doctor', 'health'];
    case 'all': return ['hospital', 'doctor', 'health'];
    default: return ['hospital', 'doctor'];
  }
};

/**
 * Categorizes a place as government or private based on name/type keywords.
 */
const categorizePlace = (place) => {
  const name = (place.name || '').toLowerCase();
  const types = (place.types || []).join(' ').toLowerCase();

  const govtKeywords = ['government', 'govt', 'district', 'municipal', 'civil', 'public', 'state', 'national', 'panchayat', 'taluka', 'sub-district', 'primary health', 'phc', 'chc', 'community health'];
  const privateKeywords = ['private', 'multispeciality', 'multi-speciality', 'corporate'];

  for (const keyword of govtKeywords) {
    if (name.includes(keyword) || types.includes(keyword)) return 'government';
  }
  for (const keyword of privateKeywords) {
    if (name.includes(keyword) || types.includes(keyword)) return 'private';
  }

  // Default: if price_level is 0 or 1, likely government; higher likely private
  if (place.price_level !== undefined) {
    return place.price_level <= 1 ? 'government' : 'private';
  }

  return 'private'; // Default assumption
};

/**
 * Analyzes a batch of reviews using the sentiment model.
 */
const analyzeReviewsBatch = async (reviews) => {
  const analyzed = [];

  for (const review of reviews) {
    try {
      const sentimentResult = await analyzeSentiment(review.text || '');
      analyzed.push({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
        ai_analysis: {
          sentiment: sentimentResult.sentiment,
          severity: sentimentResult.severity,
          confidence: sentimentResult.confidence,
          recovery: sentimentResult.recovery_indicator
        }
      });
    } catch (err) {
      analyzed.push({
        author: review.author_name,
        rating: review.rating,
        text: review.text,
        time: review.relative_time_description,
        ai_analysis: null
      });
    }
  }

  return analyzed;
};

/**
 * Summarizes analyzed reviews into an overall assessment.
 */
const summarizeReviews = (reviews) => {
  if (!reviews || reviews.length === 0) return null;

  const sentiments = { positive: 0, negative: 0, neutral: 0 };
  let totalConfidence = 0;

  for (const review of reviews) {
    if (review.ai_analysis) {
      sentiments[review.ai_analysis.sentiment]++;
      totalConfidence += review.ai_analysis.confidence;
    }
  }

  const total = reviews.length;
  const avgConfidence = total > 0 ? Math.round((totalConfidence / total) * 100) / 100 : 0;
  const dominant = Object.entries(sentiments).reduce((max, [k, v]) => v > max[1] ? [k, v] : max, ['neutral', 0]);

  let recommendation;
  if (sentiments.positive > sentiments.negative * 2) {
    recommendation = 'Highly Recommended — overwhelmingly positive patient experiences';
  } else if (sentiments.positive > sentiments.negative) {
    recommendation = 'Recommended — mostly positive reviews with some concerns';
  } else if (sentiments.negative > sentiments.positive) {
    recommendation = 'Caution Advised — significant negative feedback from patients';
  } else {
    recommendation = 'Mixed Reviews — consider visiting for a personal assessment';
  }

  return {
    overall_sentiment: dominant[0],
    positive_count: sentiments.positive,
    negative_count: sentiments.negative,
    neutral_count: sentiments.neutral,
    avg_confidence: avgConfidence,
    recommendation
  };
};

/**
 * Calculates a combined score for ranking hospitals.
 * Weighs Google rating, review count, and AI sentiment analysis.
 */
const calculateCombinedScore = (place) => {
  const ratingScore = (place.rating || 0) / 5; // 0-1
  const reviewCountScore = Math.min((place.total_reviews || 0) / 100, 1); // 0-1, capped at 100 reviews

  let sentimentScore = 0.5; // default neutral
  if (place.review_summary) {
    const summary = place.review_summary;
    sentimentScore = summary.overall_sentiment === 'positive' ? 0.9 :
                     summary.overall_sentiment === 'neutral' ? 0.5 : 0.2;
  }

  // Weighted combined score: 40% rating, 30% sentiment, 20% review volume, 10% open status
  const openBonus = place.open_now ? 1 : 0;
  const score = (0.4 * ratingScore) + (0.3 * sentimentScore) + (0.2 * reviewCountScore) + (0.1 * openBonus);

  return Math.round(score * 100) / 100;
};

module.exports = {
  searchHospitals
};
