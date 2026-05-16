/**
 * Design philosophy for restaurant services: support discovery with concise, reliable calls that let the UI focus on atmosphere and clarity.
 */
import { api } from '@/services/api';
import type { ApiEnvelope, Restaurant, RestaurantAvailabilityResponse, RestaurantInput } from '@/types/api';

export const restaurantService = {
  async list() {
    const response = await api.get<ApiEnvelope<Restaurant[]>>('/restaurants');
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiEnvelope<Restaurant>>(`/restaurants/${id}`);
    return response.data.data;
  },

  async getAvailability(id: number, params: { date: string; time: string; guestCount: number }) {
    const response = await api.get<ApiEnvelope<RestaurantAvailabilityResponse>>(`/restaurants/${id}/availability`, {
      params
    });
    return response.data.data;
  },

  async create(payload: RestaurantInput) {
    const response = await api.post<ApiEnvelope<Restaurant>>('/restaurants', payload);
    return response.data.data;
  },

  async update(id: number, payload: Partial<RestaurantInput>) {
    const response = await api.put<ApiEnvelope<Restaurant>>(`/restaurants/${id}`, payload);
    return response.data.data;
  },

  async remove(id: number) {
    const response = await api.delete<ApiEnvelope<{ success: boolean }>>(`/restaurants/${id}`);
    return response.data;
  }
};
