import jwt, { SignOptions } from 'jsonwebtoken';

export interface TokenPayload {
  id: string;
  role: string;
}

interface TokenOptions extends SignOptions {
  accessExpiresIn?: string;
  refreshExpiresIn?: string;
}

export function generateTokens(
  payload: TokenPayload,
  accessSecret: string,
  refreshSecret: string,
  options?: TokenOptions,
) {
  const accessExpiresIn: string | number =
    options?.accessExpiresIn !== undefined ? options.accessExpiresIn : '15m';

  const refreshExpiresIn: string | number =
    options?.refreshExpiresIn !== undefined ? options.refreshExpiresIn : '1d';

  const accessToken = jwt.sign(payload, accessSecret, {
    expiresIn: accessExpiresIn,
  } as SignOptions);
  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiresIn,
  } as SignOptions);

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
