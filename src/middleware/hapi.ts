import { Request, ResponseToolkit, Lifecycle } from '@hapi/hapi';

import { verifyToken, verifyRefreshToken } from '../jwt';

declare module '@hapi/hapi' {
  interface RequestApplicationState {
    user?: any;
  }
}

export function authenticateToken(accessSecret: string) {
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

    if (decoded === null) {
      return h
        .response({ message: 'Forbidden: Invalid or expired token' })
        .code(403);
    }

    request.app.user = decoded;
    return h.continue;
  };
}

export function authenticateRefreshToken(refreshSecret: string) {
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

    if (decoded === null) {
      return h
        .response({ message: 'Forbidden: Invalid or expired refresh token' })
        .code(403);
    }

    request.app.user = decoded;
    return h.continue;
  };
}
