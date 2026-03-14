const express = require('express');
const router = express.Router();
const extractController = require('../controllers/extract.controller');

// POST /api/extract
router.post('/', extractController.extract);

module.exports = router;
