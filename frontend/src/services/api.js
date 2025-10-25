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

// Clients (legacy - redirige vers contacts)
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  search: (term) => api.get(`/clients/search/${term}`),
};

// Contacts (nouveau système)
export const contactsAPI = {
  getAll: (filters) => {
    const params = new URLSearchParams();
    if (filters?.actif !== undefined) params.append('actif', filters.actif);
    if (filters?.type_personne) params.append('type_personne', filters.type_personne);
    return api.get(`/contacts?${params.toString()}`);
  },
  getById: (id) => api.get(`/contacts/${id}`),
  create: (data) => api.post('/contacts', data),
  update: (id, data) => api.put(`/contacts/${id}`, data),
  delete: (id) => api.delete(`/contacts/${id}`),
  toggleActif: (id) => api.patch(`/contacts/${id}/toggle-actif`),
  search: (term, filters) => {
    const params = new URLSearchParams();
    if (filters?.actif !== undefined) params.append('actif', filters.actif);
    if (filters?.type_personne) params.append('type_personne', filters.type_personne);
    return api.get(`/contacts/search/${term}?${params.toString()}`);
  },
  getStats: () => api.get('/contacts/stats'),
  getByTag: (tagId, filters) => {
    const params = new URLSearchParams();
    if (filters?.actif !== undefined) params.append('actif', filters.actif);
    return api.get(`/contacts/by-tag/${tagId}?${params.toString()}`);
  },
  // Tags
  addTag: (contactId, tagId) => api.post(`/contacts/${contactId}/tags/${tagId}`),
  removeTag: (contactId, tagId) => api.delete(`/contacts/${contactId}/tags/${tagId}`),
  // Relations
  addRelation: (contactId, data) => api.post(`/contacts/${contactId}/relations`, data),
  removeRelation: (contactId, relationId) => api.delete(`/contacts/${contactId}/relations/${relationId}`),
  getInterlocuteurs: (contactId) => api.get(`/contacts/${contactId}/interlocuteurs`),
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
