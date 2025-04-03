import axios from 'axios';
import axiosRetry from 'axios-retry';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.11:8000/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false
});

// Add request interceptor
apiClient.interceptors.request.use(
  config => {
    console.log('Sending Request:', {
      url: config.url,
      method: config.method,
      data: config.data
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  response => {
    console.log('Response Success:', response.data);
    return response;
  },
  error => {
    console.error('Response Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

axiosRetry(apiClient, { retries: 3 });

export default apiClient;