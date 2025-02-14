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
  console.log('🔹 Using SECRET_KEY in generateToken:', SECRET_KEY); // Debugging
  return jwt.sign(payload, SECRET_KEY, { expiresIn } as jwt.SignOptions);
}

export function verifyToken(token: string) {
  try {
    console.log('🔹 Verifying token:', token);
    console.log('🔹 Using SECRET_KEY in verifyToken:', SECRET_KEY);

    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('✅ Token successfully verified:', decoded);
    return decoded;
  } catch (err: any) {
    if (err.message === 'jwt malformed') {
      console.error('❌ JWT Verification Error: Malformed token detected.');
    } else {
      console.error('❌ JWT Verification Error:', err.message);
    }
    return null;
  }
}
