const express = require("express");
const router = express.Router();
const { handleTimeline } = require("../controllers/timeline.controller");

// GET /api/timeline/:drug
router.get("/:drug", handleTimeline);

module.exports = router;
