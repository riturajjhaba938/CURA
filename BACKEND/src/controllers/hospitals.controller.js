const { searchHospitalsZembra } = require('../services/hospitalFinderZembra.service');

/**
 * POST /api/hospitals
 * Body: {
 *   location: "Delhi, India",                    (required)
 *   type: "hospital" | "clinic" | "all",         (optional)
 *   category: "government" | "private" | "all",  (optional)
 *   min_rating: 3.5,                             (optional)
 *   analyze_reviews: true                        (optional)
 * }
 */
const findHospitals = async (req, res) => {
  const { location, type, category, min_rating, analyze_reviews } = req.body;

  if (!location) {
    return res.status(400).json({ error: 'location is required (e.g., Delhi, India)' });
  }

  try {
    const result = await searchHospitalsZembra({
      location,
      type: type || 'all',
      category: category || 'all',
      minRating: min_rating || 0,
      analyzeReviews: analyze_reviews !== false
    });
    res.json(result);
  } catch (error) {
    console.error(`Hospital Finder Zembra Error: ${error.message}`);
    res.status(500).json({ error: error.message || 'Failed to search hospitals using Zembra.io' });
  }
};

module.exports = {
  findHospitals
};
