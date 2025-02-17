import { Context, Next } from 'koa';
import { verifyToken, verifyRefreshToken } from '../jwt';

export function authenticateToken(accessSecret: string) {
  return async (ctx: Context, next: Next) => {
    // Skip authentication for unknown routes
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

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token, accessSecret);

    if (!user) {
      ctx.status = 403; // Invalid token should return Forbidden
      ctx.body = { message: 'Forbidden: Invalid or expired token' };
      return;
    }

    ctx.state.user = user;
    await next(); // Allow protected route to execute
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

    const token = authHeader.split(' ')[1];
    const user = verifyRefreshToken(token, refreshSecret);

    if (!user) {
      ctx.status = 403; // Invalid refresh token should return Forbidden
      ctx.body = { message: 'Forbidden: Invalid or expired refresh token' };
      return;
    }

    ctx.state.user = user;
    ctx.status = 200; // ✅ Ensure response status is set to 200 for refresh
    await next();
  };
}
