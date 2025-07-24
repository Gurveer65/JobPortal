import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://127.0.0.1:8000/api',
  baseURL: 'https://jobportal-9mgb.onrender.com/api/'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default API;
