import { Context, Next } from 'koa';

import { verifyToken, verifyRefreshToken } from '../jwt';

export function authenticateToken(accessSecret: string) {
  return async (ctx: Context, next: Next) => {
    // skip auth for unknown routes
    if (ctx.path !== '/protected') {
      await next();
      return;
    }

    const authHeader = ctx.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized: No token provided or invalid format' };
      return;
    }

    const [, token] = authHeader.split(' ');
    const user = verifyToken(token, accessSecret);

    if (!user) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden: Invalid or expired token' };
      return;
    }

    ctx.state.user = user;
    await next();
  };
}

export function authenticateRefreshToken(refreshSecret: string) {
  return async (ctx: Context, next: Next) => {
    if (ctx.path !== '/refresh') {
      await next();
      return;
    }

    const authHeader = ctx.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized: No token provided or invalid format' };
      return;
    }

    const [, token] = authHeader.split(' ');
    const user = verifyRefreshToken(token, refreshSecret);

    if (!user) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden: Invalid or expired refresh token' };
      return;
    }

    ctx.state.user = user;
    ctx.status = 200;
    await next();
  };
}
