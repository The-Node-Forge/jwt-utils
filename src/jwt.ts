import jwt from 'jsonwebtoken';

const SECRET_KEY = '1234567890';

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

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (err: any) {
    console.error('❌ JWT Verification Error:', err.message);
    return null;
  }
}
