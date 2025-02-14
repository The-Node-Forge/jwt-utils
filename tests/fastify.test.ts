import Fastify from 'fastify';
import request from 'supertest';
import { generateToken } from '../src/jwt';
import authenticateToken from '../src/middleware/fastify';

const app = Fastify();

console.log('🔹 Registering authenticateToken middleware...');
app.addHook('onRequest', authenticateToken); // ✅ Attach middleware as a global hook

app.get('/protected', async (req, reply) => {
  console.log('🔹 Handling request in /protected route...');
  console.log('🔹 Current request user:', (req as any).user || 'No user found');

  if (!(req as any).user) {
    console.log('❌ User not found in request');
    return reply.status(401).send({ message: 'Unauthorized' });
  }
  reply.send({ message: 'Protected', user: (req as any).user });
});
beforeAll(async () => {
  console.log('🔹 Starting Fastify app...');
  await app.ready();
});

afterAll(async () => {
  console.log('🔹 Closing Fastify app...');
  await app.close();
  console.log('✅ Fastify server closed');
});

describe('Fastify Middleware: authenticateToken', () => {
  let token: string;

  beforeAll(() => {
    token = generateToken({ id: 'test-user', role: 'admin' });
    console.log('🔹 Test token generated:', token);
  });

  test('✅ Allows access with valid token', async () => {
    console.log('🔹 Sending request with valid token...');
    const response = await request(app.server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    console.log('🔹 Response status:', response.status);
    console.log('🔹 Response body:', response.body);

    expect(response.status).toBe(200);
  });

  test('❌ Rejects access with invalid token', async () => {
    console.log('🔹 Sending request with malformed token...');
    const response = await request(app.server)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    console.log('🔹 Response status:', response.status);
    console.log('🔹 Response body:', response.body);

    expect(response.status).toBe(403);
  });

  test('❌ Rejects access with invalid token', async () => {
    console.log('🔹 Sending request with invalid token...');
    const response = await request(app.server)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403);
  });
});
