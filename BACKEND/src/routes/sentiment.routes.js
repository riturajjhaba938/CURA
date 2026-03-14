const express = require('express');
const router = express.Router();
const sentimentController = require('../controllers/sentiment.controller');

// POST /api/sentiment
router.post('/', sentimentController.sentiment);

module.exports = router;
