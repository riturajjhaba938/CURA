const express = require('express');
const router = express.Router();
const hospitalsController = require('../controllers/hospitals.controller');

// POST /api/hospitals
router.post('/', hospitalsController.findHospitals);

module.exports = router;
