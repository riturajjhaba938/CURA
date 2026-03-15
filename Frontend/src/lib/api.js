import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Wrapper for POST /api/extract
export const extractText = async (text) => {
  try {
    const response = await api.post('/extract', { text });
    return response.data;
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};

// Wrapper for POST /api/verify
export const verifySource = async (sourceId, sourceType) => {
  try {
    const response = await api.post('/verify', { source_id: sourceId, source_type: sourceType });
    return response.data;
  } catch (error) {
    console.error("Error verifying source:", error);
    throw error;
  }
};

export default api;
