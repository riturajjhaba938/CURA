const express = require('express');
const router = express.Router();
const vapiService = require('../services/vapi.service');
const traceService = require('../services/voiceTrace.service');

// POST /api/voice/webhook - Vapi Webhook Receiver
router.post('/webhook', async (req, res) => {
  try {
    const result = await vapiService.processVapiWebhook(req.body);
    if (result) {
      // In a real app, you'd store this transcript in the DB
      console.log(`[Vapi Trace] Processed session ${result.call_id}`);
    }
    res.status(200).send('Webhook Received');
  } catch (error) {
    console.error("Vapi Webhook Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/voice/trace/:insight_id - Traceability Data
router.get('/trace/:insight_id', async (req, res) => {
  try {
    const trace = await traceService.getTraceData(req.params.insight_id);
    res.json(trace);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
