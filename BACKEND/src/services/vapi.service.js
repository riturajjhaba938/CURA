const axios = require('axios');

/**
 * Service for Vapi AI Integration (Deepgram Transcriber).
 * Manages voice assistants and fetches transcripts.
 */

const getVapiHeaders = () => {
  return {
    'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Fetches a specific call transcript from Vapi.
 */
const getCallTranscript = async (callId) => {
  try {
    const response = await axios.get(`${process.env.VAPI_BASE_URL}/call/${callId}`, {
      headers: getVapiHeaders()
    });
    return response.data.transcript;
  } catch (error) {
    console.error("Vapi Transcript Fetch Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch transcript from Vapi");
  }
};

/**
 * Processes a Vapi webhook (e.g., when a call ends).
 */
const processVapiWebhook = async (payload) => {
  // Logic to handle message types like 'end-of-call-report'
  const { type, call } = payload;
  
  if (type === 'end-of-call-report') {
    return {
      call_id: call.id,
      transcript: call.transcript,
      summary: call.analysis?.summary,
      timestamp: new Date().toISOString()
    };
  }
  
  return null;
};

module.exports = {
  getCallTranscript,
  processVapiWebhook
};
