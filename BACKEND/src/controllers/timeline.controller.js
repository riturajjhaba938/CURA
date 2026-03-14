const { getTimeline } = require("../services/timeline.service");
const logger = require("../utils/logger");

/**
 * GET /api/timeline/:drug
 */
const handleTimeline = async (req, res) => {
  try {
    const { drug } = req.params;

    if (!drug) {
      return res.status(400).json({ error: "Missing required parameter: drug" });
    }

    logger.info(`Timeline request received for drug: "${drug}"`);
    const result = await getTimeline(drug);

    return res.status(200).json(result);
  } catch (error) {
    logger.error(`Timeline controller error: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleTimeline };
