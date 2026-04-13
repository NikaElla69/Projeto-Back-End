jest.mock('../../config/database/connection', () => ({
  executeQuery: jest.fn(),
  selectQuery: jest.fn(),
  pool: { getConnection: jest.fn() }
}));

import { executeQuery, selectQuery } from '../../config/database/connection';
import { ReservationModel } from '../../models/reservation.model';

const executeQueryMock = executeQuery as jest.MockedFunction<typeof executeQuery>;
const selectQueryMock = selectQuery as jest.MockedFunction<typeof selectQuery>;

describe('ReservationModel', () => {
  it('should create a reservation and return joined reservation details', async () => {
    executeQueryMock.mockResolvedValue({ insertId: 11, affectedRows: 1 } as any);
    selectQueryMock.mockResolvedValueOnce([
      {
        id: 11,
        user_id: 1,
        restaurant_id: 8,
        table_id: 4,
        reservation_date: '2026-05-20',
        reservation_time: '20:00:00',
        guest_count: 4,
        status: 'pending',
        customer_notes: 'Aniversário',
        rejection_reason: null,
        created_at: new Date('2026-04-12T00:00:00Z'),
        updated_at: new Date('2026-04-12T00:00:00Z'),
        customer_name: 'Camilla Gomes',
        customer_email: 'camilla@reserveai.com',
        restaurant_name: 'Pizzaria Maresia',
        restaurant_owner_id: 2,
        table_number: 'A01',
        table_capacity: 4
      }
    ] as any);

    const reservation = await ReservationModel.create({
      userId: 1,
      restaurantId: 8,
      tableId: 4,
      reservationDate: '2026-05-20',
      reservationTime: '20:00:00',
      guestCount: 4,
      customerNotes: 'Aniversário'
    });

    expect(executeQueryMock).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO reservations'),
      [1, 8, 4, '2026-05-20', '20:00:00', 4, 'Aniversário']
    );
    expect(reservation).toEqual(
      expect.objectContaining({
        id: 11,
        restaurant_name: 'Pizzaria Maresia',
        table_number: 'A01',
        status: 'pending'
      })
    );
  });
});
