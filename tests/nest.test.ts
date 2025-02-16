import { JwtAuthGuard } from '../src/middleware/nest';
import { ExecutionContext } from '@nestjs/common';
import { generateToken } from '../src/jwt';
import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

describe('NestJS JWT Guard', () => {
  let guard: JwtAuthGuard;
  let mockContext: Partial<ExecutionContext>;

  beforeEach(() => {
    guard = new JwtAuthGuard();
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: {} }),
      }),
    };
  });

  test('❌ Throws UnauthorizedException if no auth header', () => {
    expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  test('❌ Throws ForbiddenException if token is invalid', () => {
    const httpContext = mockContext.switchToHttp?.();
    const request = httpContext?.getRequest?.();
    if (request) {
      request.headers.authorization = 'Bearer invalid_token';
    }
    expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
      ForbiddenException,
    );
  });

  test('✅ Allows access with valid token and attaches user to request', () => {
    const token = generateToken({ id: 'user123', role: 'admin' });
    const mockRequest = {
      headers: { authorization: `Bearer ${token}` },
      user: { id: '', role: '' },
    };
    const httpContext = mockContext.switchToHttp?.();
    const getRequest = httpContext?.getRequest as jest.Mock;
    if (getRequest) {
      getRequest.mockReturnValue(mockRequest);
    }

    expect(guard.canActivate(mockContext as ExecutionContext)).toBe(true);
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user.id).toBe('user123');
  });
});
