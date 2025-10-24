import axios from 'axios';

const API_URL = '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token à chaque requête
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

// Auth
export const authAPI = {
  login: (username, password) => api.post('/auth/login', { username, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
};

// Clients
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  search: (term) => api.get(`/clients/search/${term}`),
};

// Chantiers
export const chantiersAPI = {
  getAll: () => api.get('/chantiers'),
  getById: (id) => api.get(`/chantiers/${id}`),
  getByClient: (clientId) => api.get(`/chantiers/client/${clientId}`),
  create: (data) => api.post('/chantiers', data),
  update: (id, data) => api.put(`/chantiers/${id}`, data),
  delete: (id) => api.delete(`/chantiers/${id}`),
};

// Photos
export const photosAPI = {
  upload: (chantierId, formData) => {
    return api.post(`/photos/upload/${chantierId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadMultiple: (chantierId, formData) => {
    return api.post(`/photos/upload-multiple/${chantierId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getByChantier: (chantierId) => api.get(`/photos/chantier/${chantierId}`),
  delete: (id) => api.delete(`/photos/${id}`),
  updateDescription: (id, description) => api.put(`/photos/${id}`, { description }),
};

export default api;
