/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

let Koa: any;

try {
  Koa = require('koa');
} catch (err) {
  throw new Error('Koa is not installed. Please install it with: npm install koa');
}

import { Context, Next } from 'koa';

import { verifyToken } from '../jwt';

export async function globalAuthHandler(ctx: Context, next: Next) {
  // Skip authentication for unknown routes
  if (ctx.path !== '/protected') {
    await next();
    return;
  }

  const token = ctx.headers.authorization?.split(' ')[1];

  if (!token) {
    ctx.status = 401; // Missing token = Unauthorized
    ctx.body = { message: 'Unauthorized: No token provided' };
    return;
  }

  const user = verifyToken(token);
  if (!user) {
    ctx.status = 403; // Invalid token = Forbidden
    ctx.body = { message: 'Forbidden: Invalid or expired token' };
    return;
  }

  ctx.state.user = user;
  await next(); // Allow protected route to execute
}
