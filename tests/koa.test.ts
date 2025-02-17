import Koa from 'koa';
import request from 'supertest';
import { Server } from 'http';

import { generateTokens } from '../src/jwt';
import { authenticateToken, authenticateRefreshToken } from '../src/middleware/koa';

const accessSecret = 'test-access-secret';
const refreshSecret = 'test-refresh-secret';

const app = new Koa();

app.use(authenticateToken(accessSecret));
app.use(authenticateRefreshToken(refreshSecret));

app.use(async (ctx) => {
  if (ctx.path === '/protected') {
    if (!ctx.state.user) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized' };
      return;
    }
    ctx.body = { message: 'Protected', user: ctx.state.user };
    return;
  }

  if (ctx.path === '/refresh') {
    if (!ctx.state.user) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized' };
      return;
    }
    ctx.body = { message: 'Refresh Token Valid', user: ctx.state.user };
    return;
  }
});

let server: Server;

beforeAll(() => {
  server = app.listen();
});

afterAll(() => {
  if (server) {
    server.close();
  }
});

describe('Koa Middleware: authenticateToken & authenticateRefreshToken', () => {
  let accessToken: string;
  let refreshToken: string;

  beforeAll(() => {
    ({ accessToken, refreshToken } = generateTokens(
      { id: 'test-user', role: 'admin' },
      accessSecret,
      refreshSecret,
    ));
  });

  test('✅ Allows access with valid access token', async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe('test-user');
  });

  test('✅ Allows access with valid refresh token', async () => {
    const response = await request(server)
      .get('/refresh')
      .set('Authorization', `Bearer ${refreshToken}`);

    expect(response.status).toBe(200); // ✅ Ensure correct status code
    expect(response.body.user.id).toBe('test-user');
  });

  test('❌ Rejects access with missing token', async () => {
    const response = await request(server).get('/protected');
    expect(response.status).toBe(401);
  });

  test('❌ Rejects access with invalid access token', async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403); // ✅ Should be 403 Forbidden
  });

  test('❌ Rejects access with invalid refresh token', async () => {
    const response = await request(server)
      .get('/refresh')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403); // ✅ Should be 403 Forbidden
  });

  test('✅ Returns 404 for unknown routes', async () => {
    const response = await request(server).get('/unknown');
    expect(response.status).toBe(404);
  });

  test("❌ Rejects token missing 'Bearer' prefix", async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', `${accessToken}`);

    expect(response.status).toBe(401);
  });
});
