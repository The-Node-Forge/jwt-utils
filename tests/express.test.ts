import express from 'express';
import request from 'supertest';

import { generateTokens, verifyToken } from '../src/jwt';
import {
  authenticateToken,
  authenticateRefreshToken,
} from '../src/middleware/express';

const accessSecret = 'test-access-secret';
const refreshSecret = 'test-refresh-secret';

const app = express();
app.use(express.json());

app.get('/protected', authenticateToken(accessSecret), (req: any, res: any) => {
  res.json({ message: 'Protected', user: req.user });
});

app.get(
  '/refresh',
  authenticateRefreshToken(refreshSecret),
  (req: any, res: any) => {
    res.json({ message: 'Refresh Token Valid', user: req.user });
  },
);

describe('Express Middleware: authenticateToken & authenticateRefreshToken', () => {
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
    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe('test-user');
  });

  test('✅ Allows access with valid refresh token', async () => {
    const response = await request(app)
      .get('/refresh')
      .set('Authorization', `Bearer ${refreshToken}`);

    expect(response.status).toBe(200);
    expect(response.body.user.id).toBe('test-user');
  });

  test('❌ Rejects access with missing token', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
  });

  test('❌ Rejects access with invalid access token', async () => {
    const response = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403);
  });

  test('❌ Rejects access with invalid refresh token', async () => {
    const response = await request(app)
      .get('/refresh')
      .set('Authorization', 'Bearer invalid_token');

    expect(response.status).toBe(403);
  });
});

describe('verifyToken Function', () => {
  let accessToken: string;

  beforeAll(() => {
    ({ accessToken } = generateTokens(
      { id: 'test-user', role: 'admin' },
      accessSecret,
      refreshSecret,
    ));
  });

  test('✅ Successfully verifies a valid access token', () => {
    const decoded = verifyToken(accessToken, accessSecret);
    expect(decoded).toMatchObject({ id: 'test-user', role: 'admin' });
  });

  test('❌ Returns null for an invalid token', () => {
    const decoded = verifyToken('invalid_token', accessSecret);
    expect(decoded).toBeNull();
  });

  test('❌ Returns null for a token signed with the wrong secret', () => {
    const wrongSecret = 'wrong-secret-key';
    const decoded = verifyToken(accessToken, wrongSecret);
    expect(decoded).toBeNull();
  });
});
