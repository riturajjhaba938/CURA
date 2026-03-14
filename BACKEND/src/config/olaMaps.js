const axios = require('axios');

// Ola Maps API base URL
const OLA_MAPS_BASE_URL = 'https://api.olamaps.io';

const olaMapsClient = axios.create({
  baseURL: OLA_MAPS_BASE_URL,
  timeout: 10000
});

// Attach API key to every request
olaMapsClient.interceptors.request.use((config) => {
  config.params = config.params || {};
  config.params.api_key = process.env.OLAMAPS_API_KEY;
  return config;
});

module.exports = {
  olaMapsClient
};
