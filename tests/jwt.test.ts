import { Algorithm } from 'jsonwebtoken';

import {
  generateTokens,
  verifyToken,
  verifyRefreshToken,
  TokenOptions,
} from '../src/jwt';

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

  describe('hardening', () => {
    test('❌ Throws when access and refresh secrets are identical', () => {
      expect(() => generateTokens(payload, 'same-secret', 'same-secret')).toThrow(
        /must be different/,
      );
    });

    test.each(['none', 'RS256', 'ES256'])(
      '❌ Throws for unsupported signing algorithm %s',
      (algorithm) => {
        expect(() =>
          generateTokens(payload, accessSecret, refreshSecret, {
            algorithm,
          } as unknown as TokenOptions),
        ).toThrow(/Unsupported algorithm/);
      },
    );

    test.each(['HS256', 'HS384', 'HS512'] as const)(
      '✅ Round-trips %s tokens',
      (algorithm) => {
        const tokens = generateTokens(payload, accessSecret, refreshSecret, {
          algorithm,
        });
        expect(verifyToken(tokens.accessToken, accessSecret)).toMatchObject(payload);
        expect(verifyRefreshToken(tokens.refreshToken, refreshSecret)).toMatchObject(
          payload,
        );
      },
    );

    test('❌ Rejects an unsigned (alg: none) token', () => {
      const unsigned = [
        Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString(
          'base64url',
        ),
        Buffer.from(JSON.stringify(payload)).toString('base64url'),
        '',
      ].join('.');

      expect(verifyToken(unsigned, accessSecret)).toBeNull();
      expect(verifyRefreshToken(unsigned, refreshSecret)).toBeNull();
    });

    test('❌ Rejects a token signed with a non-HMAC algorithm header', () => {
      const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
      const forged = [
        header.toString('base64url'),
        Buffer.from(JSON.stringify(payload)).toString('base64url'),
        'c2ln',
      ].join('.');

      expect(verifyToken(forged, accessSecret)).toBeNull();
    });
  });
});
