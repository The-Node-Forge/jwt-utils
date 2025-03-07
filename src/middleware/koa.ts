/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

let koa: any;
let verifyToken: any;
let verifyRefreshToken: any;

export function authenticateToken(accessSecret: string) {
  if (!koa) {
    try {
      koa = require('koa');
    } catch (error) {
      throw new Error(
        "Koa middleware is being used, but 'koa' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyToken) {
    ({ verifyToken } = require('../jwt'));
  }

  return async (ctx: any, next: any) => {
    // Skip auth for unknown routes
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
  if (!koa) {
    try {
      koa = require('koa');
    } catch (error) {
      throw new Error(
        "Koa middleware is being used, but 'koa' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyRefreshToken) {
    ({ verifyRefreshToken } = require('../jwt'));
  }

  return async (ctx: any, next: any) => {
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
