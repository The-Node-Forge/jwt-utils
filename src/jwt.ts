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
    algorithm: options?.algorithm ?? 'HS256',
    audience: options?.audience ?? 'my-app',
    issuer: options?.issuer ?? 'auth-service',
  } as SignOptions);

  const refreshToken = jwt.sign(payload, refreshSecret, {
    expiresIn: refreshExpiresIn,
    algorithm: options?.algorithm ?? 'HS256',
    audience: options?.audience ?? 'my-app',
    issuer: options?.issuer ?? 'auth-service',
  } as SignOptions);

  return { accessToken, refreshToken };
}

export function verifyToken(
  token: string,
  accessSecret: string,
  options?: { audience?: string; issuer?: string },
) {
  try {
    return jwt.verify(token, accessSecret, {
      audience: options?.audience,
      issuer: options?.issuer,
    });
  } catch (err: any) {
    console.error('❌ JWT Verification Error:', err.message);
    return null;
  }
}

export function verifyRefreshToken(
  token: string,
  refreshSecret: string,
  options?: { audience?: string; issuer?: string },
) {
  try {
    return jwt.verify(token, refreshSecret, {
      audience: options?.audience,
      issuer: options?.issuer,
    });
  } catch (err: any) {
    console.error('❌ JWT Refresh Token Verification Error:', err.message);
    return null;
  }
}
