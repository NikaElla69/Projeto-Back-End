jest.mock('../../config/database/connection', () => ({
  executeQuery: jest.fn(),
  selectQuery: jest.fn(),
  pool: { getConnection: jest.fn().mockResolvedValue({ release: jest.fn() }) }
}));

import request from 'supertest';
import app from '../../app';
import { selectQuery } from '../../config/database/connection';

const selectQueryMock = selectQuery as jest.MockedFunction<typeof selectQuery>;

describe('Restaurant integration', () => {
  it('should return available tables for a restaurant through GET /api/restaurants/:id/availability', async () => {
    selectQueryMock
      .mockResolvedValueOnce([
        {
          id: 8,
          owner_id: 2,
          name: 'Pizzaria Maresia',
          description: 'Referência local para reservas.',
          cuisine_type: 'Pizza',
          phone: '(44) 99999-0000',
          city: 'Peabiru',
          address: 'Rua Central, 100',
          logo_url: null,
          reservation_limit_time: '20:30:00',
          no_show_policy: 'Atrasos podem gerar perda da mesa.',
          created_at: new Date('2026-04-12T00:00:00Z')
        }
      ] as any)
      .mockResolvedValueOnce([
        {
          id: 4,
          restaurant_id: 8,
          table_number: 'A01',
          capacity: 4,
          location: 'Salão principal',
          is_active: 1,
          created_at: new Date('2026-04-12T00:00:00Z')
        }
      ] as any);

    const response = await request(app).get('/api/restaurants/8/availability').query({
      date: '2026-05-20',
      time: '20:00:00',
      guestCount: 4
    });

    expect(response.status).toBe(200);
    expect(response.body.data.restaurant.name).toBe('Pizzaria Maresia');
    expect(response.body.data.availableTables).toHaveLength(1);
    expect(response.body.data.availableTables[0].table_number).toBe('A01');
  });
});
