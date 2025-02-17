import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, verifyRefreshToken } from '../jwt';

export const authenticateToken = (accessSecret: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token, accessSecret);

    if (!user) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    (req as any).user = user;
    next();
  };
};

export const authenticateRefreshToken = (refreshSecret: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const user = verifyRefreshToken(token, refreshSecret);

    if (!user) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    (req as any).user = user;
    next();
  };
};
