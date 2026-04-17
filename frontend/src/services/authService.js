import { apiFetch } from './api.js';

export const authService = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body }),
  login: (body) => apiFetch('/auth/login', { method: 'POST', body }),
  me: (token) => apiFetch('/auth/me', { token })
};
