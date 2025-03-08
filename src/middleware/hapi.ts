/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

import type { Request, ResponseToolkit, Lifecycle } from '@hapi/hapi';

let hapi: any;
let verifyToken: any;
let verifyRefreshToken: any;

declare module '@hapi/hapi' {
  interface RequestApplicationState {
    user?: any;
  }
}

export function authenticateToken(accessSecret: string) {
  if (!hapi) {
    try {
      hapi = require('@hapi/hapi');
    } catch (error) {
      throw new Error(
        "Hapi middleware is being used, but '@hapi/hapi' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyToken) {
    ({ verifyToken } = require('../jwt'));
  }

  return async (
    request: Request,
    h: ResponseToolkit,
  ): Promise<Lifecycle.ReturnValue> => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return h
        .response({ message: 'Unauthorized: No token provided or invalid format' })
        .code(401);
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      return h.response({ message: 'Unauthorized: Missing token' }).code(401);
    }

    const decoded = verifyToken(token, accessSecret);

    if (!decoded) {
      return h
        .response({ message: 'Forbidden: Invalid or expired token' })
        .code(403);
    }

    request.app.user = decoded;
    return h.continue;
  };
}

export function authenticateRefreshToken(refreshSecret: string) {
  if (!hapi) {
    try {
      hapi = require('@hapi/hapi');
    } catch (error) {
      throw new Error(
        "Hapi middleware is being used, but '@hapi/hapi' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyRefreshToken) {
    ({ verifyRefreshToken } = require('../jwt'));
  }

  return async (
    request: Request,
    h: ResponseToolkit,
  ): Promise<Lifecycle.ReturnValue> => {
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return h
        .response({ message: 'Unauthorized: No token provided or invalid format' })
        .code(401);
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      return h.response({ message: 'Unauthorized: Missing token' }).code(401);
    }

    const decoded = verifyRefreshToken(token, refreshSecret);

    if (!decoded) {
      return h
        .response({ message: 'Forbidden: Invalid or expired refresh token' })
        .code(403);
    }

    request.app.user = decoded;
    return h.continue;
  };
}
