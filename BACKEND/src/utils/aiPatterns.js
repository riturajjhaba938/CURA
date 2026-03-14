const { AxiosError } = require('axios');

/**
 * Executes a function with automatic retries and exponential backoff
 * Typical Reliability AI Pattern
 * 
 * @param {Function} attemptFunc - An async function that makes the API call.
 * @param {number} maxRetries - Maximum number of retries before permanently failing.
 * @param {number} baseDelayMs - Base delay for exponential backoff.
 * @returns The resolved data from the attemptFunc.
 */
const withRetry = async (attemptFunc, maxRetries = 3, baseDelayMs = 1000) => {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await attemptFunc();
    } catch (error) {
      attempt++;
      
      // Determine if error is retryable (5xx, timeouts, network errors)
      const isRetryable = _isRetryableError(error);
      
      if (!isRetryable || attempt >= maxRetries) {
        console.error(`Attempt ${attempt} failed permanently: ${error.message}`);
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = Math.min((baseDelayMs * Math.pow(2, attempt)) + (Math.random() * 500), 10000);
      console.warn(`Attempt ${attempt} failed: ${error.message}. Retrying in ${Math.round(delay)}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Checks if an error warrants a retry.
 */
const _isRetryableError = (error) => {
  if (error instanceof AxiosError) {
    if (!error.response) return true; // Network error / timeout
    const status = error.response.status;
    return status >= 500 || status === 429; // Server errors or rate limiting
  }
  // Generic network errors or timeouts from Node
  return error.code === 'ECONNABORTED' || error.code === 'ECONNRESET' || error.message.includes('timeout');
};

/**
 * Safely parses JSON from a plain-text LLM generation, stripping markdown blocks.
 * Typical Structured Outputs AI Pattern
 * 
 * @param {string} rawText - The unformatted string from the AI.
 * @param {Object} fallback - The default object to return if parsing fails entirely.
 * @returns {Object} The parsed object or fallback.
 */
const parseStructuredOutput = (rawText, fallback = {}) => {
  if (!rawText || typeof rawText !== 'string') return fallback;
  
  try {
    // Attempt 1: Direct JSON parsing
    return JSON.parse(rawText);
  } catch (error) {
    // Attempt 2: Clean markdown blocks (```json ... ```)
    try {
      let cleaned = rawText.trim();
      if (cleaned.startsWith('```json')) cleaned = cleaned.replace(/^```json/, '');
      if (cleaned.startsWith('```')) cleaned = cleaned.replace(/^```/, '');
      if (cleaned.endsWith('```')) cleaned = cleaned.replace(/```$/, '');
      
      return JSON.parse(cleaned.trim());
    } catch (fallbackError) {
      console.error('Failed to parse AI output into structured JSON format. Using fallback.', { rawText });
      return fallback;
    }
  }
};

/**
 * Constructs a system prompt establishing an empathetic persona.
 * Typical Humanized Persona AI Pattern
 * 
 * @returns {string} The system prompt string.
 */
const buildHumanizedPrompt = () => {
  return `You are a careful, medically trained data specialist who approaches patient testimonials with immense empathy. 
Your primary task is to extract exact medical entities from the provided text, while respecting the patient's lived experience. 
You must output ONLY valid JSON without any markdown formatting.
Ensure your extraction strictly matches this schema:
{
  "drug": "string | null",
  "side_effect": "string | null",
  "dosage": "string | null",
  "timeline_marker": "string | null"
}`;
};

module.exports = {
  withRetry,
  parseStructuredOutput,
  buildHumanizedPrompt
};
