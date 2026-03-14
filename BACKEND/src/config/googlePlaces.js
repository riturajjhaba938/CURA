const axios = require('axios');

// Google Places API (New) base URL
const GOOGLE_PLACES_BASE_URL = 'https://places.googleapis.com/v1';

const googlePlacesClient = axios.create({
  baseURL: GOOGLE_PLACES_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach API key to every request via header
googlePlacesClient.interceptors.request.use((config) => {
  config.headers['X-Goog-Api-Key'] = process.env.GOOGLE_PLACES_API_KEY;
  return config;
});

module.exports = {
  googlePlacesClient
};
