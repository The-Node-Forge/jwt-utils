import { NextApiRequest, NextApiResponse } from 'next';

import { verifyToken } from '../jwt';

export function withAuth(
  handler: (req: NextApiRequest, res: NextApiResponse) => void,
) {
  return (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const [, token] = authHeader.split(' ');
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // attach user data to request
    req.user = decoded as { id: string; role: string };
    return handler(req, res);
  };
}
