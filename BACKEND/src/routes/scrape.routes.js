const express = require("express");
const router = express.Router();
const { handleScrape } = require("../controllers/scrape.controller");

// POST /api/scrape
router.post("/", handleScrape);

module.exports = router;
