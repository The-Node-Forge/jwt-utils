import { Algorithm } from 'jsonwebtoken';

import { generateTokens, verifyToken, verifyRefreshToken } from '../src/jwt';

describe('JWT Utility Functions', () => {
  const payload = { id: '12345', role: 'admin' };
  const accessSecret = 'test-access-secret';
  const refreshSecret = 'test-refresh-secret';
  const signOptions: {
    accessExpiresIn: string;
    refreshExpiresIn: string;
    algorithm: Algorithm;
    audience: string;
    issuer: string;
  } = {
    accessExpiresIn: '1h',
    refreshExpiresIn: '7d',
    algorithm: 'HS256',
    audience: 'my-app',
    issuer: 'auth-service',
  };

  let accessToken: string;
  let refreshToken: string;

  beforeAll(() => {
    ({ accessToken, refreshToken } = generateTokens(
      payload,
      accessSecret,
      refreshSecret,
      signOptions,
    ));
  });

  test('should generate valid access and refresh tokens', () => {
    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
  });

  test('should generate tokens with custom expiration and sign options', () => {
    const customTokens = generateTokens(payload, accessSecret, refreshSecret, {
      accessExpiresIn: '2h',
      refreshExpiresIn: '10d',
      algorithm: 'HS512',
      audience: 'custom-app',
      issuer: 'custom-service',
    });

    expect(typeof customTokens.accessToken).toBe('string');
    expect(typeof customTokens.refreshToken).toBe('string');
  });

  test('should verify a valid access token', () => {
    const decoded = verifyToken(accessToken, accessSecret);
    expect(decoded).toMatchObject(payload);
  });

  test('should verify a valid refresh token', () => {
    const decoded = verifyRefreshToken(refreshToken, refreshSecret);
    expect(decoded).toMatchObject(payload);
  });

  test('should return null for an invalid access token', () => {
    const decoded = verifyToken('invalid_token', accessSecret);
    expect(decoded).toBeNull();
  });

  test('should return null for an invalid refresh token', () => {
    const decoded = verifyRefreshToken('invalid_refresh_token', refreshSecret);
    expect(decoded).toBeNull();
  });

  test('should return null for an expired access token', () => {
    const { accessToken } = generateTokens(payload, accessSecret, refreshSecret, {
      accessExpiresIn: '15s',
    });
    jest.useFakeTimers().setSystemTime(Date.now() + 16 * 1000);
    const decoded = verifyToken(accessToken, accessSecret);
    expect(decoded).toBeNull();
    jest.useRealTimers();
  });

  test('should return null for an expired refresh token', () => {
    const { refreshToken } = generateTokens(payload, accessSecret, refreshSecret, {
      refreshExpiresIn: '1h',
    });
    jest.useFakeTimers().setSystemTime(Date.now() + 61 * 60 * 1000);
    const decoded = verifyRefreshToken(refreshToken, refreshSecret);
    expect(decoded).toBeNull();
    jest.useRealTimers();
  });

  test('should fail verification when audience does not match', () => {
    const mismatchedToken = generateTokens(payload, accessSecret, refreshSecret, {
      ...signOptions,
      audience: 'wrong-app',
    }).accessToken;

    const decoded = verifyToken(mismatchedToken, accessSecret, {
      audience: 'my-app',
    });
    expect(decoded).toBeNull();
  });

  test('should fail verification when issuer does not match', () => {
    const mismatchedToken = generateTokens(payload, accessSecret, refreshSecret, {
      ...signOptions,
      issuer: 'wrong-service',
    }).accessToken;

    const decoded = verifyToken(mismatchedToken, accessSecret, {
      issuer: 'auth-service',
    });
    expect(decoded).toBeNull();
  });
});
