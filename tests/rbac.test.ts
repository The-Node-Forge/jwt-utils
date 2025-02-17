import { Request, Response, NextFunction } from 'express';

import { authorizeRoles } from '../src/middleware/rbac';

describe('RBAC Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    mockReq = { user: { id: '1', role: 'admin' } };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn(), statusCode: 0 };
    next = jest.fn();
  });

  test('✅ Allows access for authorized roles', () => {
    authorizeRoles('admin')(mockReq as Request, mockRes as Response, next);
    expect(next).toHaveBeenCalled();
  });

  test('❌ Denies access for unauthorized roles', () => {
    mockReq.user = { id: '2', role: 'user' };
    authorizeRoles('admin')(mockReq as Request, mockRes as Response, next);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Forbidden: Insufficient Permissions',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('❌ Denies access if user is missing', () => {
    mockReq.user = undefined;
    authorizeRoles('admin')(mockReq as Request, mockRes as Response, next);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Unauthorized: No user data found',
    });
    expect(next).not.toHaveBeenCalled();
  });

  test('✅ Allows multiple authorized roles', () => {
    mockReq.user = { id: '3', role: 'editor' };
    authorizeRoles('admin', 'editor')(mockReq as Request, mockRes as Response, next);
    expect(next).toHaveBeenCalled();
  });

  test('❌ Denies access if role is not in allowed roles', () => {
    mockReq.user = { id: '4', role: 'guest' };
    authorizeRoles('admin', 'editor')(mockReq as Request, mockRes as Response, next);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: 'Forbidden: Insufficient Permissions',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
