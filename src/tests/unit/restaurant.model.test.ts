jest.mock('../../config/database/connection', () => ({
  executeQuery: jest.fn(),
  selectQuery: jest.fn(),
  pool: { getConnection: jest.fn() }
}));

import { executeQuery, selectQuery } from '../../config/database/connection';
import { RestaurantModel } from '../../models/restaurant.model';

const executeQueryMock = executeQuery as jest.MockedFunction<typeof executeQuery>;
const selectQueryMock = selectQuery as jest.MockedFunction<typeof selectQuery>;

describe('RestaurantModel', () => {
  it('should create a restaurant with owner and reservation rules', async () => {
    executeQueryMock.mockResolvedValue({ insertId: 8, affectedRows: 1 } as any);
    selectQueryMock.mockResolvedValueOnce([
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
    ] as any);

    const restaurant = await RestaurantModel.create({
      ownerId: 2,
      name: 'Pizzaria Maresia',
      description: 'Referência local para reservas.',
      cuisineType: 'Pizza',
      phone: '(44) 99999-0000',
      city: 'Peabiru',
      address: 'Rua Central, 100',
      reservationLimitTime: '20:30:00',
      noShowPolicy: 'Atrasos podem gerar perda da mesa.'
    });

    expect(executeQueryMock).toHaveBeenCalled();
    expect(restaurant).toEqual(
      expect.objectContaining({
        id: 8,
        owner_id: 2,
        name: 'Pizzaria Maresia'
      })
    );
  });
});
