/**
 * Design philosophy for reservation services: keep the booking flow transparent and dependable, from creation to cancellation.
 */
import { api } from '@/services/api';
import type {
  ApiEnvelope,
  Reservation,
  ReservationInput,
  UpdateReservationInput,
  UpdateReservationStatusInput
} from '@/types/api';

export const reservationService = {
  async list() {
    const response = await api.get<ApiEnvelope<Reservation[]>>('/reservations');
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiEnvelope<Reservation>>(`/reservations/${id}`);
    return response.data.data;
  },

  async create(payload: ReservationInput) {
    const response = await api.post<ApiEnvelope<Reservation>>('/reservations', payload);
    return response.data.data;
  },

  async update(id: number, payload: UpdateReservationInput) {
    const response = await api.put<ApiEnvelope<Reservation>>(`/reservations/${id}`, payload);
    return response.data.data;
  },

  async updateStatus(id: number, payload: UpdateReservationStatusInput) {
    const response = await api.patch<ApiEnvelope<Reservation>>(`/reservations/${id}/status`, payload);
    return response.data.data;
  },

  async remove(id: number) {
    const response = await api.delete<ApiEnvelope<{ success: boolean }>>(`/reservations/${id}`);
    return response.data;
  }
};
