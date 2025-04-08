import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.5.26:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: false,
  timeout: 30000
});

apiClient.interceptors.request.use(
  config => {
    if (config.method === 'put' && config.data) {
      let data = typeof config.data === 'string' ? JSON.parse(config.data) : { ...config.data };
      
      // Ensure recipients is always an array with valid objects
      if (data.recipients) {
        // Convert to array if it's not
        const recipientsArray = Array.isArray(data.recipients) ? data.recipients : [data.recipients];
        
        data.recipients = recipientsArray
          .filter(Boolean) // Remove falsy values
          .map(recipient => {
            // Handle string recipients
            if (typeof recipient === 'string') {
              const trimmedName = recipient.trim();
              return trimmedName ? { name: trimmedName, position: '' } : null;
            }
            
            // Handle object recipients
            const name = recipient?.name?.trim() || '';
            return name ? {
              name: name,
              position: (recipient?.position || '').trim()
            } : null;
          })
          .filter(Boolean); // Remove null entries
      }

      // Ensure at least one valid recipient
      if (!data.recipients?.length) {
        throw new Error('At least one recipient with a name is required');
      }

      config.data = JSON.stringify(data);
    }
    
    console.log('Request:', {
      method: config.method,
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => {
    // Log successful response
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    };
    console.error('API Error Details:', errorDetails);
    return Promise.reject(error);
  }
);

export default apiClient;