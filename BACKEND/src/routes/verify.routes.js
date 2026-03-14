const express = require('express');
const router = express.Router();
const verifyController = require('../controllers/verify.controller');

// POST /api/verify
router.post('/', verifyController.verify);

module.exports = router;
