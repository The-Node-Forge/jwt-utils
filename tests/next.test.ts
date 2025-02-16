import { withAuth } from '../src/middleware/next';
import { generateToken } from '../src/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

describe('Next.js Middleware', () => {
  let mockReq: Partial<NextApiRequest>;
  let mockRes: Partial<NextApiResponse>;
  beforeEach(() => {
    mockReq = { headers: {} };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });

  test('✅ Allows access with valid token', () => {
    mockReq.headers = mockReq.headers || {};
    mockReq.headers.authorization = `Bearer ${generateToken({ id: 'user123', role: 'admin' })}`;
    const handler = withAuth((req, res) => res.json({ user: req.user }));
    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.json).toHaveBeenCalledWith({ user: expect.any(Object) });
  });

  test('❌ Rejects access with missing token', () => {
    const handler = withAuth((req, res) => res.json({ user: req.user }));
    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  test('❌ Rejects access with invalid token', () => {
    mockReq.headers = { authorization: 'Bearer invalid_token' };
    const handler = withAuth((req, res) => res.json({ user: req.user }));
    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Forbidden' });
  });

  test('✅ Attaches user to request when token is valid', () => {
    const token = generateToken({ id: 'user123', role: 'admin' });
    mockReq.headers = { authorization: `Bearer ${token}` };
    const handler = withAuth((req, res) => res.json({ user: req.user }));
    handler(mockReq as NextApiRequest, mockRes as NextApiResponse);
    expect(mockRes.json).toHaveBeenCalledWith({ user: expect.any(Object) });
    expect(mockReq.user).toBeDefined();
    expect(mockReq.user?.id).toBe('user123');
  });
});
