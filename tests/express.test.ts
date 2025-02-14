import express from 'express';
import request from 'supertest';
import { generateToken } from '../src/jwt';
import { authenticateToken } from '../src/middleware/express';

const app = express();
app.use(express.json());
app.use(authenticateToken);

app.get('/protected', (req: any, res: any) => {
  if (!(req as any).user) return res.status(401).json({ message: 'Unauthorized' });
  res.json({ message: 'Protected', user: (req as any).user });
});

describe('Express Middleware: authenticateToken', () => {
  let token: string;

  beforeAll(() => {
    token = generateToken({ id: 'test-user', role: 'admin' });
  });

  test('✅ Allows access with valid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe('test-user');
  });

  test('❌ Rejects access with missing token', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
  });

  test('❌ Rejects access with invalid token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403);
  });
});
