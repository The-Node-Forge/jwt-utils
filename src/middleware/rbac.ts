import { Request, Response, NextFunction } from 'express';

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: 'Forbidden: Insufficient Permissions' });
    }
    next();
  };
}
