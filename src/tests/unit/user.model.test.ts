jest.mock('../../config/database/connection', () => ({
  executeQuery: jest.fn(),
  selectQuery: jest.fn(),
  pool: { getConnection: jest.fn() }
}));

import { executeQuery, selectQuery } from '../../config/database/connection';
import { UserModel } from '../../models/user.model';

const executeQueryMock = executeQuery as jest.MockedFunction<typeof executeQuery>;
const selectQueryMock = selectQuery as jest.MockedFunction<typeof selectQuery>;

describe('UserModel', () => {
  it('should create a user and hide the password hash', async () => {
    executeQueryMock.mockResolvedValue({ insertId: 1, affectedRows: 1 } as any);
    selectQueryMock.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Camilla Gomes',
        email: 'camilla@reserveai.com',
        password_hash: 'hashed-password',
        role: 'customer',
        created_at: new Date('2026-04-12T00:00:00Z')
      }
    ] as any);

    const user = await UserModel.create({
      name: 'Camilla Gomes',
      email: 'camilla@reserveai.com',
      passwordHash: 'hashed-password',
      role: 'customer'
    });

    expect(executeQueryMock).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      ['Camilla Gomes', 'camilla@reserveai.com', 'hashed-password', 'customer']
    );
    expect(user).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'Camilla Gomes',
        email: 'camilla@reserveai.com',
        role: 'customer'
      })
    );
    expect(user).not.toHaveProperty('password_hash');
  });
});
