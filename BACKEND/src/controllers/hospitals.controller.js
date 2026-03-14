const { searchHospitals } = require('../services/hospitalFinder.service');

/**
 * POST /api/hospitals
 * Body: {
 *   location: "28.6139,77.2090" or "Delhi",    (required)
 *   radius: 5000,                                (optional, meters)
 *   type: "hospital" | "clinic" | "all",         (optional)
 *   category: "government" | "private" | "all",  (optional)
 *   min_rating: 3.5,                             (optional)
 *   max_price: 2,                                (optional, 0-4)
 *   analyze_reviews: true                        (optional)
 * }
 */
const findHospitals = async (req, res) => {
  const { location, radius, type, category, min_rating, max_price, analyze_reviews } = req.body;

  if (!location) {
    return res.status(400).json({ error: 'location is required (lat,lng or city name)' });
  }

  try {
    const result = await searchHospitals({
      location,
      radius: radius || 5000,
      type: type || 'all',
      category: category || 'all',
      minRating: min_rating || 0,
      maxPrice: max_price !== undefined ? max_price : 4,
      analyzeReviews: analyze_reviews !== false
    });
    res.json(result);
  } catch (error) {
    console.error(`Hospital Finder Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to search hospitals' });
  }
};

module.exports = {
  findHospitals
};
