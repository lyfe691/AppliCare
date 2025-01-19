import axios from 'axios';
import { API_URL, APP_ENV } from '../config/urls';

// this file creates an axios instance with default config
// meaning that all requests made with this instance will have the same base url, headers, and other configurations.
// it also adds a request interceptor to add the auth tok

// exmaple: api.get('/users') will make a GET request to '/api/users' with the auth token in the headers

// creates axios instance with default config
const api = axios.create({
  // Use proxy in development, full URL in production
  baseURL: APP_ENV === 'development' ? '/api' : API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// adds request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('appliCareUser'));
    if (user?.token) {
      config.headers['Authorization'] = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// adds response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      console.error('Response Error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
        url: error.config.url
      });
      
      const message = error.response.data || 'An error occurred';
      // Only redirect for auth errors on non-login endpoints
      if ((error.response.status === 403 || error.response.status === 401) && 
          !error.config.url.endsWith('/auth/login')) {
        localStorage.removeItem('appliCareUser');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject(new Error('No response received from server'));
    } else {
      console.error('Request setup error:', error.message);
      return Promise.reject(new Error('Error setting up the request'));
    }
  }
);

export default api;