const { spawn } = require("child_process");
const path = require("path");
const logger = require("../utils/logger");
const { processScrapedComments } = require("./pipeline.service");

/**
 * Service to handle Reddit scraping via the Python script.
 * 
 * @param {string} drug - The drug to scrape
 * @param {string} mode - "quick" or "full"
 * @returns {Promise<Object>} - The scraping and pipeline results
 */
const runScraper = (drug, mode = "quick") => {
  return new Promise((resolve, reject) => {
    const scrapeMode = mode === "full" ? "--full" : "--quick";
    const scriptPath = path.join(__dirname, "../../scripts/scraper.py");
    const pythonPath = process.env.PYTHON_PATH || "python";

    logger.info(`[ScraperService] Starting scrape for "${drug}" (${scrapeMode})`);

    const python = spawn(pythonPath, [scriptPath, drug, scrapeMode], {
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

    python.on("close", async (code) => {
      if (code !== 0) {
        logger.error(`[ScraperService] Python script failed with code ${code}: ${stderr}`);
        return reject(new Error(`Scraping failed: ${stderr}`));
      }

      try {
        const result = JSON.parse(stdout);
        
        // Auto-trigger the NER pipeline
        logger.info(`[ScraperService] Scraping successful. Starting AI pipeline for "${drug}"...`);
        let pipelineResult = null;
        try {
          pipelineResult = await processScrapedComments(drug);
        } catch (pipelineError) {
          logger.error(`[ScraperService] AI Pipeline failed: ${pipelineError.message}`);
        }

        resolve({
          drug,
          saved: result,
          pipeline: pipelineResult
        });
      } catch (parseError) {
        logger.error(`[ScraperService] Failed to parse JSON output: ${stdout}`);
        reject(new Error("Failed to parse scraper output"));
      }
    });
  });
};

module.exports = { runScraper };
