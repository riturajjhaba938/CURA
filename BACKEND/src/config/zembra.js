const axios = require('axios');

// Zembra API base URL
const ZEMBRA_BASE_URL = 'https://api.zembra.io';

const zembraClient = axios.create({
  baseURL: ZEMBRA_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Bearer token to every request
zembraClient.interceptors.request.use((config) => {
  if (process.env.ZEMBRA_API_KEY) {
    config.headers.Authorization = `Bearer ${process.env.ZEMBRA_API_KEY}`;
  }
  return config;
});

module.exports = {
  zembraClient
};
