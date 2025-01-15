import axios from 'axios';

// this file creates an axios instance with default config
// meaning that all requests made with this instance will have the same base url, headers, and other configurations.
// it also adds a request interceptor to add the auth tok

// exmaple usage: api.get('/users') will make a GET request to '/api/users' with the auth token in the headers

// creates axios instance with default config
const api = axios.create({
  baseURL: '/api',
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
      const message = error.response.data || 'An error occurred';
      if (error.response.status === 403) {
        localStorage.removeItem('appliCareUser');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
      return Promise.reject(new Error(message));
    } else if (error.request) {
      return Promise.reject(new Error('No response received from server'));
    } else {
      return Promise.reject(new Error('Error setting up the request'));
    }
  }
);

export default api;