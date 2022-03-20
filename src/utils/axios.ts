import axios from 'axios';

// axios instance for making requests
const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  config.baseURL = 'http://127.0.0.1:5000';
  config.withCredentials = true;

  const token = localStorage.getItem('token') ?? undefined;

  if (!token) {
    return config;
  }

  if (!config.headers) {
    config.headers = {};
  }

  config.headers.Authorization = `Bearer ${token}`;

  return config;
})

export default axiosInstance;