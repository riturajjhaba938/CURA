const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function apiCall(endpoint, data = {}, method = 'POST', headers = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    },
    body: method !== 'GET' ? JSON.stringify(data) : undefined
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || 'API Request Failed');
  return result;
}

export const medicalApi = {
  extract: (text) => apiCall('/extract', { text }),
  analyzeSentiment: (text) => apiCall('/sentiment', { text }),
  verifyClaim: (drug, side_effect) => apiCall('/verify', { drug, side_effect }),
  checkFact: (claim_text, drug, side_effect) => apiCall('/bs-meter', { claim_text, drug, side_effect }),
  searchHospitals: (query) => apiCall('/hospitals', query),
  anonymize: (text) => apiCall('/anonymize', { text })
};

export const authApi = {
  login: (email, password) => apiCall('/auth/login', { email, password }),
  register: (userData) => apiCall('/auth/register', userData)
};
