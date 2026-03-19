import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000
});

const getStoredToken = () => {
  const adminToken = localStorage.getItem('adminToken');
  const farmerToken = localStorage.getItem('farmerToken');
  const consumerToken = localStorage.getItem('consumerToken');
  return adminToken || farmerToken || consumerToken;
};

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    const url = config?.url || '';
    const isAuthEndpoint = url.includes('/auth/');

    if (token && !isAuthEndpoint && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
