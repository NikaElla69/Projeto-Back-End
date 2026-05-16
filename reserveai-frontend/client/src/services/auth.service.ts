/**
 * Design philosophy for authentication services: make access feel frictionless for diners while respecting the ReserveAí security boundary.
 */
import { api } from '@/services/api';
import type { ApiEnvelope, AuthPayload, LoginInput, RegisterInput, User } from '@/types/api';

export const authService = {
  async login(payload: LoginInput) {
    const response = await api.post<ApiEnvelope<AuthPayload>>('/auth/login', payload);
    return response.data.data;
  },

  async register(payload: RegisterInput) {
    const response = await api.post<ApiEnvelope<AuthPayload>>('/auth/register', payload);
    return response.data.data;
  },

  async me() {
    const response = await api.get<ApiEnvelope<User>>('/auth/me');
    return response.data.data;
  }
};
