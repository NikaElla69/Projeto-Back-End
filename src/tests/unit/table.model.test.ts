jest.mock('../../config/database/connection', () => ({
  executeQuery: jest.fn(),
  selectQuery: jest.fn(),
  pool: { getConnection: jest.fn() }
}));

import { executeQuery, selectQuery } from '../../config/database/connection';
import { TableModel } from '../../models/table.model';

const executeQueryMock = executeQuery as jest.MockedFunction<typeof executeQuery>;
const selectQueryMock = selectQuery as jest.MockedFunction<typeof selectQuery>;

describe('TableModel', () => {
  it('should create a restaurant table with capacity', async () => {
    executeQueryMock.mockResolvedValue({ insertId: 4, affectedRows: 1 } as any);
    selectQueryMock.mockResolvedValueOnce([
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

    const table = await TableModel.create({
      restaurantId: 8,
      tableNumber: 'A01',
      capacity: 4,
      location: 'Salão principal',
      isActive: true
    });

    expect(executeQueryMock).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO tables'),
      [8, 'A01', 4, 'Salão principal', true]
    );
    expect(table).toEqual(
      expect.objectContaining({
        id: 4,
        restaurant_id: 8,
        table_number: 'A01',
        capacity: 4
      })
    );
  });
});
