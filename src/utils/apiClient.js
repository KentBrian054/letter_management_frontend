import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.94:8000/api', // Make sure this matches your actual API URL
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

// Modify request interceptor to handle CSRF token more gracefully
apiClient.interceptors.request.use(
  async config => {
    try {
      // Only attempt to get CSRF token if it's not a GET request and token is missing
      if (config.method !== 'get' && !document.cookie.includes('XSRF-TOKEN')) {
        await axios.get('http://192.168.5.94:8000/sanctum/csrf-cookie', {
          timeout: 5000 // Add shorter timeout for CSRF request
        });
      }
    } catch (error) {
      console.warn('CSRF token fetch failed:', error);
      // Continue with request even if CSRF fetch fails
    }
    
    if (config.headers) {
      delete config.headers['cache-control'];
    }
    config.retryCount = config.retryCount || 0;
    return config;
  },
  error => Promise.reject(error)
);

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const config = error.config;
    
    // Retry up to 3 times on timeout or network errors
    if ((error.code === 'ECONNABORTED' || !error.response) && config.retryCount < 3) {
      config.retryCount += 1;
      return new Promise(resolve => setTimeout(() => resolve(apiClient(config)), 1000));
    }

    if (!error.response) {
      error.response = {
        status: 0,
        data: {
          message: 'Network Error - Unable to connect to server'
        }
      };
    }
    return Promise.reject(error);
  }
);

export default apiClient;