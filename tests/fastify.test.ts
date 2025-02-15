import Fastify from 'fastify';
import request from 'supertest';

import { generateToken } from '../src/jwt';
import authenticateToken from '../src/middleware/fastify';

const app = Fastify();

app.addHook('onRequest', authenticateToken);

app.get('/protected', async (req, reply) => {
  if (!(req as any).user) {
    return reply.status(401).send({ message: 'Unauthorized' });
  }
  reply.send({ message: 'Protected', user: (req as any).user });
});
beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

describe('Fastify Middleware: authenticateToken', () => {
  let token: string;

  beforeAll(() => {
    token = generateToken({ id: 'test-user', role: 'admin' });
  });

  test('✅ Allows access with valid token', async () => {
    const response = await request(app.server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  test('❌ Rejects access with invalid token', async () => {
    const response = await request(app.server)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403);
  });

  test('❌ Rejects access with invalid token', async () => {
    const response = await request(app.server)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403);
  });
});
