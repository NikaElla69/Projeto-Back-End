/**
 * Design philosophy for table services: expose seating details with enough precision for booking decisions, never with noisy transport concerns.
 */
import { api } from '@/services/api';
import type { ApiEnvelope, TableEntity, TableInput } from '@/types/api';

export const tableService = {
  async listByRestaurant(restaurantId: number) {
    const response = await api.get<ApiEnvelope<TableEntity[]>>(`/tables/restaurant/${restaurantId}`);
    return response.data.data;
  },

  async getById(id: number) {
    const response = await api.get<ApiEnvelope<TableEntity>>(`/tables/${id}`);
    return response.data.data;
  },

  async create(payload: TableInput) {
    const response = await api.post<ApiEnvelope<TableEntity>>('/tables', payload);
    return response.data.data;
  },

  async update(id: number, payload: Partial<TableInput>) {
    const response = await api.put<ApiEnvelope<TableEntity>>(`/tables/${id}`, payload);
    return response.data.data;
  },

  async remove(id: number) {
    const response = await api.delete<ApiEnvelope<{ success: boolean }>>(`/tables/${id}`);
    return response.data;
  }
};
