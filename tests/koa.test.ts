import Koa from 'koa';
import request from 'supertest';
import { generateToken } from '../src/jwt';
import { globalAuthHandler } from '../src/middleware/koa';

const app = new Koa();

// ✅ First, check if a route exists
app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = { message: 'Not Found' };
  }
});

// ✅ Apply global authentication middleware
app.use(globalAuthHandler);

// ✅ Define a protected route
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
});

// ✅ Start the server
const server = app.listen();

describe('Koa Middleware: globalAuthHandler (No koa-router)', () => {
  let token: string;

  beforeAll(() => {
    token = generateToken({ id: 'test-user', role: 'admin' });
  });

  test('✅ Allows access with valid token', async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe('test-user');
  });

  test('❌ Rejects access with missing token', async () => {
    const response = await request(server).get('/protected');
    expect(response.status).toBe(401);
  });

  test('❌ Rejects access with invalid token', async () => {
    const response = await request(server)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403);
  });

  test('✅ Returns 404 for unknown routes', async () => {
    const response = await request(server).get('/unknown');
    expect(response.status).toBe(404);
  });
});
