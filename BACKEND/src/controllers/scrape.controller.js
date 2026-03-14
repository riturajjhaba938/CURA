const logger = require("../utils/logger");
const { runScraper } = require("../services/redditScraper.service");

/**
 * POST /api/scrape
 * Body: { "drug": "accutane", "mode": "quick" | "full" }
 */
const handleScrape = async (req, res) => {
  try {
    const { drug, mode } = req.body;

    if (!drug) {
      return res.status(400).json({ error: "Missing required field: drug" });
    }

    logger.info(`Scrape request received for drug: "${drug}" (${mode || "quick"})`);
    const result = await runScraper(drug, mode);

    return res.status(200).json({
      message: "Scraping completed successfully",
      ...result,
    });
  } catch (error) {
    logger.error(`Scrape controller error: ${error.message}`);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};

module.exports = { handleScrape };
