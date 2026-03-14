const axios = require('axios');
const http = require('http');
const https = require('https');

// Configure OpenFDA API client
const openfdaClient = axios.create({
  baseURL: process.env.OPENFDA_API_URL || 'https://api.fda.gov/drug',
  headers: {
    'Content-Type': 'application/json'
  },
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true })
  // The FDA API accepts a key via query param or authorization, depending on the endpoint.
  // Example for adding a default API key constraint if one exists:
});

// Interceptor to add API key to requests if present
openfdaClient.interceptors.request.use(config => {
  if (process.env.OPENFDA_API_KEY) {
    config.params = { ...config.params, api_key: process.env.OPENFDA_API_KEY };
  }
  return config;
});

module.exports = {
  openfdaClient
};
