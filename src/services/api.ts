import axios from 'axios';
import { authService } from './authService';

const api = axios.create({
  baseURL: 'https://pruebareactjs.test-class.com/Api/'
});

// Token automático en TODAS las requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Logout automático si 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
    }
    return Promise.reject(error);
  }
);

export default api;