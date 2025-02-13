import jwt from 'jsonwebtoken';

const SECRET_KEY: jwt.Secret = process.env.JWT_SECRET || '1234567890';

export interface TokenPayload {
  id: string;
  [key: string]: any;
}

export function generateToken(
  payload: TokenPayload,
  expiresIn: string = '1h',
): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayload;
  } catch (error) {
    return null;
  }
}
