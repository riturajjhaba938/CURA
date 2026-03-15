const axios = require('axios');

async function verifyBackend() {
  console.log("--- Verifying BACKEND for Vapi & Voice Suite ---");
  
  try {
    // 1. Check Root
    const health = await axios.get('http://localhost:3000/');
    console.log("Health Check:", health.data.status === "ok" ? "✅ SUCCESS" : "❌ FAILED");

    // 2. Check Voice Webhook route (should return 200 even with empty body)
    console.log("Testing /api/voice/webhook...");
    const webhook = await axios.post('http://localhost:3000/api/voice/webhook', { type: "test" });
    console.log("Webhook Route:", webhook.status === 200 ? "✅ SUCCESS" : "❌ FAILED");

    // 3. Check Trace route
    console.log("Testing /api/voice/trace/abc...");
    const trace = await axios.get('http://localhost:3000/api/voice/trace/abc');
    console.log("Trace Route:", trace.data.insight_id ? "✅ SUCCESS" : "❌ FAILED");

  } catch (err) {
    console.error("Verification failed:", err.message);
  }
}

verifyBackend();
