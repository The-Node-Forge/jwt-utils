import Hapi from '@hapi/hapi';

import { authenticateToken, authenticateRefreshToken } from '../src/middleware/hapi';
import { generateTokens, verifyToken, verifyRefreshToken } from '../src/jwt';

const accessSecret = 'test-access-secret';
const refreshSecret = 'test-refresh-secret';

describe('Hapi.js Middleware', () => {
  let server: Hapi.Server;

  beforeAll(async () => {
    server = Hapi.server();

    server.route({
      method: 'GET',
      path: '/protected',
      options: { pre: [{ method: authenticateToken(accessSecret) }] },
      handler: (request, h) => {
        return request.app.user
          ? { user: request.app.user }
          : h.response({ message: 'Unauthorized' }).code(401);
      },
    });

    server.route({
      method: 'GET',
      path: '/refresh',
      options: { pre: [{ method: authenticateRefreshToken(refreshSecret) }] },
      handler: (request, h) => {
        return request.app.user
          ? { user: request.app.user }
          : h.response({ message: 'Unauthorized' }).code(401);
      },
    });

    await server.start();
  });

  afterAll(async () => await server.stop());

  let accessToken: string;
  let refreshToken: string;

  beforeAll(() => {
    ({ accessToken, refreshToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    ));
  });

  test('✅ Allows access with valid access token', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.result).toHaveProperty('user');
  });

  test('✅ Allows access with valid refresh token', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/refresh',
      headers: { Authorization: `Bearer ${refreshToken}` },
    });
    expect(res.statusCode).toBe(200);
    expect(res.result).toHaveProperty('user');
  });

  test('❌ Rejects access with missing token', async () => {
    const res = await server.inject({ method: 'GET', url: '/protected' });
    expect(res.statusCode).toBe(401);
  });

  test('❌ Rejects access with invalid access token', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { Authorization: 'Bearer invalid_token' },
    });
    expect(res.statusCode).toBe(401);
  });

  test('❌ Rejects access with invalid refresh token', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/refresh',
      headers: { Authorization: 'Bearer invalid_token' },
    });
    expect(res.statusCode).toBe(401);
  });

  test("❌ Rejects token missing 'Bearer' prefix", async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/protected',
      headers: { Authorization: `${accessToken}` },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe('Token Verification Functions', () => {
  let accessToken: string;
  let refreshToken: string;

  beforeAll(() => {
    ({ accessToken, refreshToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    ));
  });

  test('✅ Successfully verifies a valid access token', () => {
    const decoded = verifyToken(accessToken, accessSecret);
    expect(decoded).toMatchObject({ id: 'user123', role: 'admin' });
  });

  test('✅ Successfully verifies a valid refresh token', () => {
    const decoded = verifyRefreshToken(refreshToken, refreshSecret);
    expect(decoded).toMatchObject({ id: 'user123', role: 'admin' });
  });

  test('❌ Returns null for an invalid access token', () => {
    const decoded = verifyToken('invalid_token', accessSecret);
    expect(decoded).toBeNull();
  });

  test('❌ Returns null for an invalid refresh token', () => {
    const decoded = verifyRefreshToken('invalid_token', refreshSecret);
    expect(decoded).toBeNull();
  });

  test('❌ Returns null for a token signed with the wrong access secret', () => {
    const wrongSecret = 'wrong-access-secret';
    const decoded = verifyToken(accessToken, wrongSecret);
    expect(decoded).toBeNull();
  });

  test('❌ Returns null for a token signed with the wrong refresh secret', () => {
    const wrongSecret = 'wrong-refresh-secret';
    const decoded = verifyRefreshToken(refreshToken, wrongSecret);
    expect(decoded).toBeNull();
  });
});
