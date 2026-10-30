import { UnauthorizedException, ExecutionContext } from '@nestjs/common';

import { AuthenticateToken } from '../src/middleware/nest';
import { generateTokens, verifyToken, verifyRefreshToken } from '../src/jwt';

describe('NestJS JWT Guard', () => {
  const accessSecret = 'test-access-secret';
  const refreshSecret = 'test-refresh-secret';

  let guard: AuthenticateToken;
  let mockContext: Partial<ExecutionContext>;

  beforeEach(() => {
    guard = new AuthenticateToken(accessSecret, refreshSecret);
    mockContext = {
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue({ headers: {}, url: '' }),
      }),
    };
  });

  test('❌ Throws UnauthorizedException if no auth header', () => {
    expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  test('❌ Throws UnauthorizedException if token is invalid', () => {
    const httpContext = mockContext.switchToHttp?.();
    const request = httpContext?.getRequest?.();
    if (request) {
      request.headers.authorization = 'Bearer invalid_token';
      request.url = '/protected';
    }
    expect(() => guard.canActivate(mockContext as ExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  test('✅ Allows access with valid access token and attaches user to request', () => {
    const { accessToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    const mockRequest = {
      headers: { authorization: `Bearer ${accessToken}` },
      user: { id: '', role: '' },
      url: '/protected',
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

  test('✅ Allows access with valid refresh token and attaches user to request', () => {
    const { refreshToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    const mockRequest = {
      headers: { authorization: `Bearer ${refreshToken}` },
      user: { id: '', role: '' },
      url: '/refresh',
    };

    const httpContext = mockContext.switchToHttp?.();
    const getRequest = httpContext?.getRequest as jest.Mock;
    if (getRequest) {
      getRequest.mockReturnValue(mockRequest);
    }

    const refreshGuard = new AuthenticateToken(accessSecret, refreshSecret, true);
    expect(refreshGuard.canActivate(mockContext as ExecutionContext)).toBe(true);
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user.id).toBe('user123');
  });

  describe('token type is not inferred from the URL', () => {
    const contextFor = (url: string, token: string) =>
      ({
        switchToHttp: () => ({
          getRequest: () => ({ headers: { authorization: `Bearer ${token}` }, url }),
        }),
      }) as unknown as ExecutionContext;

    const { accessToken, refreshToken } = generateTokens(
      { id: 'user123', role: 'admin' },
      accessSecret,
      refreshSecret,
    );

    test.each([
      '/refresh',
      '/admin?next=/refresh',
      '/admin/refresh/../x',
      '/a/refresh',
    ])('❌ Rejects a refresh token on access-guarded url %s', (url) => {
      expect(() => guard.canActivate(contextFor(url, refreshToken))).toThrow(
        UnauthorizedException,
      );
    });

    test('✅ Accepts an access token on a url containing /refresh', () => {
      expect(
        guard.canActivate(contextFor('/admin?next=/refresh', accessToken)),
      ).toBe(true);
    });

    test('❌ Rejects an access token on a refresh-guarded route', () => {
      const refreshGuard = new AuthenticateToken(accessSecret, refreshSecret, true);
      expect(() =>
        refreshGuard.canActivate(contextFor('/refresh', accessToken)),
      ).toThrow(UnauthorizedException);
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
