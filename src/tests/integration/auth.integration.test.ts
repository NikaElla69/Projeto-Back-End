jest.mock('../../config/database/connection', () => ({
  executeQuery: jest.fn(),
  selectQuery: jest.fn(),
  pool: { getConnection: jest.fn().mockResolvedValue({ release: jest.fn() }) }
}));

import request from 'supertest';
import bcrypt from 'bcryptjs';
import app from '../../app';
import { executeQuery, selectQuery } from '../../config/database/connection';

const executeQueryMock = executeQuery as jest.MockedFunction<typeof executeQuery>;
const selectQueryMock = selectQuery as jest.MockedFunction<typeof selectQuery>;

describe('Auth integration', () => {
  it('should register a new user through POST /api/auth/register', async () => {
    selectQueryMock
      .mockResolvedValueOnce([] as any)
      .mockResolvedValueOnce([
        {
          id: 1,
          name: 'Camilla Gomes',
          email: 'camilla@reserveai.com',
          password_hash: 'hashed-password',
          role: 'customer',
          created_at: new Date('2026-04-12T00:00:00Z')
        }
      ] as any);
    executeQueryMock.mockResolvedValue({ insertId: 1, affectedRows: 1 } as any);

    const response = await request(app).post('/api/auth/register').send({
      name: 'Camilla Gomes',
      email: 'camilla@reserveai.com',
      password: '123456'
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe('camilla@reserveai.com');
    expect(response.body.data.token).toBeDefined();
  });

  it('should login an existing user through POST /api/auth/login', async () => {
    const passwordHash = await bcrypt.hash('123456', 10);

    selectQueryMock.mockResolvedValueOnce([
      {
        id: 1,
        name: 'Camilla Gomes',
        email: 'camilla@reserveai.com',
        password_hash: passwordHash,
        role: 'customer',
        created_at: new Date('2026-04-12T00:00:00Z')
      }
    ] as any);

    const response = await request(app).post('/api/auth/login').send({
      email: 'camilla@reserveai.com',
      password: '123456'
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user.email).toBe('camilla@reserveai.com');
    expect(response.body.data.token).toBeDefined();
  });
});
