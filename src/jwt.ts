import jwt from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  role: string;
}

export function generateTokens(
  payload: TokenPayload,
  accessSecret: string,
  refreshSecret: string,
) {
  const accessToken = jwt.sign(payload, accessSecret, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: '1d' });

  return { accessToken, refreshToken };
}

export function verifyToken(token: string, accessSecret: string) {
  try {
    return jwt.verify(token, accessSecret);
  } catch (err: any) {
    console.error('❌ JWT Verification Error:', err.message);
    return null;
  }
}

export function verifyRefreshToken(token: string, refreshSecret: string) {
  try {
    return jwt.verify(token, refreshSecret);
  } catch (err: any) {
    console.error('❌ JWT Refresh Token Verification Error:', err.message);
    return null;
  }
}
