const express = require('express');
const router = express.Router();
const anonymizeController = require('../controllers/anonymize.controller');

// POST /api/anonymize
router.post('/', anonymizeController.anonymize);

module.exports = router;
