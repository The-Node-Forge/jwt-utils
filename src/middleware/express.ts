/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

let express: any;

try {
  express = require('express');
} catch (err) {
  throw new Error(
    'Express is not installed. Please install it with: npm install express',
  );
}

import { Request, Response, NextFunction } from 'express';

import { verifyToken } from '../jwt';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(401);
    return;
  }

  const user = verifyToken(token);
  if (!user) {
    res.sendStatus(403);
    return;
  }
  (req as any).user = user;
  next();
};
