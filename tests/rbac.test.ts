import { authorizeRoles } from '../src/middleware/rbac';
import { Request, Response, NextFunction } from 'express';

describe('RBAC Middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let next: NextFunction;
  beforeEach(() => {
    mockReq = { user: { id: '1', role: 'admin' } };
    mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });
  test('✅ Allows access for authorized roles', () => {
    authorizeRoles('admin')(mockReq as Request, mockRes as Response, next);
    expect(next).toHaveBeenCalled();
  });
});
