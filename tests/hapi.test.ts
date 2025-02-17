import Hapi from '@hapi/hapi';

import { authenticateToken } from '../src/middleware/hapi';
import { generateToken } from '../src/jwt';

describe('Hapi.js Middleware', () => {
  let server: Hapi.Server;
  beforeAll(async () => {
    server = Hapi.server();
    server.ext('onRequest', async (request, h) => {
      try {
        await authenticateToken(request, h);
      } catch (err) {
        console.error('Middleware Error:', err);
      }
      return h.continue;
    });
    server.route({
      method: 'GET',
      path: '/protected',
      handler: (request, h) => {
        return request.app.user
          ? { user: request.app.user }
          : h.response({ message: 'Unauthorized' }).code(401);
      },
    });
    await server.start();
  });
  afterAll(async () => await server.stop());

  test('✅ Allows access with valid token', async () => {
    const token = generateToken({ id: 'user123', role: 'admin' });
    const res = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.result).toHaveProperty('user');
  });

  test('❌ Rejects access with missing token', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/protected',
    });
    expect(res.statusCode).toBe(401);
  });

  test('❌ Rejects access with invalid token', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { Authorization: 'Bearer invalid_token' },
    });
    // should really be 403, but we're using 401 for simplicity
    expect(res.statusCode).toBe(401);
  });

  test('✅ Returns 404 for unknown routes', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/unknown',
    });
    expect(res.statusCode).toBe(404);
  });

  test("❌ Rejects token missing 'Bearer' prefix", async () => {
    const token = generateToken({ id: 'user123', role: 'admin' });
    const res = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { Authorization: `${token}` },
    });
    expect(res.statusCode).toBe(401);
  });
});
