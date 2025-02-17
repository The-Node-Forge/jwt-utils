import { Request, ResponseToolkit, Lifecycle } from '@hapi/hapi';

import { verifyToken } from '../jwt';

declare module '@hapi/hapi' {
  interface RequestApplicationState {
    user?: any;
  }
}

export async function authenticateToken(
  request: Request,
  h: ResponseToolkit,
): Promise<Lifecycle.ReturnValue> {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return h.response({ message: 'Unauthorized' }).code(401);
  }

  const [, token] = authHeader.split(' ');
  try {
    const decoded = verifyToken(token);

    // Attach user to request
    request.app.user = decoded;
    return h.continue;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ JWT Verification Error:', error.message);
    } else {
      console.error('❌ JWT Verification Error:', error);
    }
    return h.response({ message: 'Forbidden' }).code(403);
  }
}
