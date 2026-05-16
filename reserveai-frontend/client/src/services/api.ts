/**
 * Design philosophy for service transport: preserve the premium calm of the interface by making networking explicit,
 * consistent and graceful, with a single gateway for authentication, headers and human-readable failures.
 */
import axios from 'axios';

export const AUTH_STORAGE_KEY = 'reserveai.auth';

const isLocalDevelopmentHost =
  typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname);

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (isLocalDevelopmentHost ? 'http://localhost:3000/api' : '');

export const api = axios.create({
  baseURL: API_BASE_URL || undefined,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const missingBaseUrlMessage =
  'Defina VITE_API_BASE_URL para apontar para a API do ReserveAí. Em desenvolvimento local, use http://localhost:3000/api.';

api.interceptors.request.use((config) => {
  if (!API_BASE_URL) {
    return Promise.reject(new Error(missingBaseUrlMessage));
  }

  const raw = localStorage.getItem(AUTH_STORAGE_KEY);

  if (raw) {
    try {
      const session = JSON.parse(raw) as { token?: string };
      if (session.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      (error.code === 'ECONNABORTED'
        ? 'A API demorou para responder. Verifique se o back-end está ativo e se VITE_API_BASE_URL está correto.'
        : 'Não foi possível concluir a requisição.');

    return Promise.reject(new Error(message));
  }
);
