import { generateTokens, verifyToken, verifyRefreshToken } from '../src/jwt';

describe('JWT Utility Functions', () => {
  const payload = { id: '12345', role: 'admin' };
  const accessSecret = 'test-access-secret';
  const refreshSecret = 'test-refresh-secret';

  let accessToken: string;
  let refreshToken: string;

  beforeAll(() => {
    ({ accessToken, refreshToken } = generateTokens(
      payload,
      accessSecret,
      refreshSecret,
    ));
  });

  test('should generate valid access and refresh tokens', () => {
    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
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
    const { accessToken } = generateTokens(payload, accessSecret, refreshSecret);
    jest.useFakeTimers().setSystemTime(Date.now() + 16 * 60 * 1000); // fastforward 16 minutes
    const decoded = verifyToken(accessToken, accessSecret);
    expect(decoded).toBeNull();
    jest.useRealTimers();
  });

  test('should return null for an expired refresh token', () => {
    const { refreshToken } = generateTokens(payload, accessSecret, refreshSecret);
    jest.useFakeTimers().setSystemTime(Date.now() + 8 * 24 * 60 * 60 * 1000); // fastforward 8 days
    const decoded = verifyRefreshToken(refreshToken, refreshSecret);
    expect(decoded).toBeNull();
    jest.useRealTimers();
  });
});
