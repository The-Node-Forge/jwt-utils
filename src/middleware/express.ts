/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

import type { VerifyTokenOptions } from '../jwt';

let express: any;
let verifyToken: any;
let verifyRefreshToken: any;

export const authenticateToken = (
  accessSecret: string,
  options?: VerifyTokenOptions,
) => {
  if (!express) {
    try {
      express = require('express');
    } catch (error) {
      throw new Error(
        "Express middleware is being used, but 'express' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyToken) {
    ({ verifyToken } = require('../jwt'));
  }

  return (req: any, res: any, next: any): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const [, token] = authHeader.split(' ');
    const user = verifyToken(token, accessSecret, options);

    if (!user) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    req.user = user;
    next();
  };
};

export const authenticateRefreshToken = (
  refreshSecret: string,
  options?: VerifyTokenOptions,
) => {
  if (!express) {
    try {
      express = require('express');
    } catch (error) {
      throw new Error(
        "Express middleware is being used, but 'express' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyRefreshToken) {
    ({ verifyRefreshToken } = require('../jwt'));
  }

  return (req: any, res: any, next: any): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const [, token] = authHeader.split(' ');
    const user = verifyRefreshToken(token, refreshSecret, options);

    if (!user) {
      res.status(403).json({ message: 'Forbidden' });
      return;
    }

    req.user = user;
    next();
  };
};
