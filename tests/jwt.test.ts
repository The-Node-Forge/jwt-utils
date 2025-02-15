import { generateToken, verifyToken } from '../src/jwt';

describe('JWT Utility Functions', () => {
  const payload = { id: '12345', role: 'admin' };
  let token: string;

  beforeAll(() => {
    token = generateToken(payload, '10m');
  });

  test('should generate a valid JWT token', () => {
    expect(typeof token).toBe('string');
  });

  test('should verify a valid JWT token', () => {
    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(payload);
  });

  test('should return null for an invalid token', () => {
    const decoded = verifyToken('invalid_token');
    expect(decoded).toBeNull();
  });
});
