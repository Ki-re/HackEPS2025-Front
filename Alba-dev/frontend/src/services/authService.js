import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Iniciar sesión
  async login(username, password) {
    const response = await api.post('/login', {
      username,
      password,
    });
    return response.data;
  },

  // Registrar nuevo usuario
  async register(userData) {
    const response = await api.post('/register', userData);
    return response.data;
  },

  // Obtener usuario actual
  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Verificar estado de salud del servidor
  async healthCheck() {
    const response = await api.get('/health');
    return response.data;
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener token
  getToken() {
    return localStorage.getItem('token');
  }
};