import { NextApiRequest, NextApiResponse } from 'next';

import { authenticateToken } from '../src/middleware/next';
import { generateTokens, verifyToken, verifyRefreshToken } from '../src/jwt';

describe('Next.js Middleware', () => {
  const accessSecret = 'test-access-secret';
  const refreshSecret = 'test-refresh-secret';

  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;

  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test('✅ Allows access with valid access token', () => {
    const { accessToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    mockReq.headers = { authorization: `Bearer ${accessToken}` };
    const handler = authenticateToken(
      (req, res) => res.json({ user: req.user }),
      accessSecret,
      refreshSecret,
      false,
    );

    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.json).toHaveBeenCalledWith({ user: expect.any(Object) });
  });

  test('✅ Allows access with valid refresh token', () => {
    const { refreshToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    mockReq.headers = { authorization: `Bearer ${refreshToken}` };
    const handler = authenticateToken(
      (req, res) => res.json({ user: req.user }),
      accessSecret,
      refreshSecret,
      true,
    );

    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.json).toHaveBeenCalledWith({ user: expect.any(Object) });
  });

  test('❌ Rejects access with missing token', () => {
    const handler = authenticateToken(
      (req, res) => res.json({ user: req.user }),
      accessSecret,
      refreshSecret,
      false,
    );

    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized: No token provided',
    });
  });

  test('❌ Rejects access with invalid token', () => {
    mockReq.headers = { authorization: 'Bearer invalid_token' };
    const handler = authenticateToken(
      (req, res) => res.json({ user: req.user }),
      accessSecret,
      refreshSecret,
      false,
    );

    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized: Invalid or expired token',
    });
  });

  test("❌ Rejects token missing 'Bearer' prefix", () => {
    const { accessToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    mockReq.headers = { authorization: `${accessToken}` };
    const handler = authenticateToken(
      (req, res) => res.json({ user: req.user }),
      accessSecret,
      refreshSecret,
      false,
    );

    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized: No token provided',
    });
  });

  test('✅ Verifies access token correctly', () => {
    const { accessToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    const decoded = verifyToken(accessToken, accessSecret);
    expect(decoded).toMatchObject({ id: 'user123', role: 'admin' });
  });

  test('✅ Verifies refresh token correctly', () => {
    const { refreshToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

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
    const { accessToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    const decoded = verifyToken(accessToken, wrongSecret);
    expect(decoded).toBeNull();
  });

  test('❌ Returns null for a token signed with the wrong refresh secret', () => {
    const wrongSecret = 'wrong-refresh-secret';
    const { refreshToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    const decoded = verifyRefreshToken(refreshToken, wrongSecret);
    expect(decoded).toBeNull();
  });
});
