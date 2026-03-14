const { spawn } = require("child_process");
const path = require("path");
const logger = require("../utils/logger");

/**
 * POST /api/scrape
 * Body: { "drug": "accutane" }
 *
 * Spawns the Python PRAW scraper script and streams the result back.
 */
const handleScrape = async (req, res) => {
  try {
    const { drug } = req.body;

    if (!drug) {
      return res.status(400).json({ error: "Missing required field: drug" });
    }

    logger.info(`Scrape request received for drug: "${drug}"`);

    const scriptPath = path.join(__dirname, "../../scripts/scraper.py");

    const python = spawn("python", [scriptPath, drug], {
      env: { ...process.env },
    });

    let stdout = "";
    let stderr = "";

    python.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    python.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    python.on("close", (code) => {
      if (code !== 0) {
        logger.error(`Python scraper exited with code ${code}: ${stderr}`);
        return res.status(500).json({
          error: "Scraping failed",
          details: stderr,
        });
      }

      try {
        const result = JSON.parse(stdout);
        return res.status(200).json({
          message: "Scraping completed successfully",
          drug,
          saved: result,
        });
      } catch (parseError) {
        logger.error(`Failed to parse scraper output: ${stdout}`);
        return res.status(500).json({
          error: "Failed to parse scraper output",
          raw: stdout,
        });
      }
    });
  } catch (error) {
    logger.error(`Scrape controller error: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { handleScrape };
