const express = require('express');
const router = express.Router();
const bsMeterController = require('../controllers/bsMeter.controller');

// POST /api/bs-meter
router.post('/', bsMeterController.bsMeter);

module.exports = router;
