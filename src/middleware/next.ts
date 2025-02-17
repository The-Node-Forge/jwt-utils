import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken, verifyRefreshToken } from '../jwt';

export function authenticateToken(
  handler: (req: NextApiRequest, res: NextApiResponse) => void,
  accessSecret: string,
  refreshSecret: string,
  allowRefreshToken: boolean = false,
) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;

    if (allowRefreshToken) {
      decoded = verifyRefreshToken(token, refreshSecret);
    } else {
      decoded = verifyToken(token, accessSecret);
    }

    if (!decoded) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid or expired token' });
    }

    (req as any).user = decoded;
    return handler(req, res);
  };
}
