/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

import type { VerifyTokenOptions } from '../jwt';

let koa: any;
let verifyToken: any;
let verifyRefreshToken: any;

/**
 * Koa middleware that requires a valid access token on every request it handles.
 * Mount it per route (e.g. with `@koa/router`) or via `app.use` to protect
 * everything after it. On success the decoded payload is set on `ctx.state.user`.
 *
 * @param accessSecret - Secret used to verify access tokens.
 */
export function authenticateToken(
  accessSecret: string,
  options?: VerifyTokenOptions,
) {
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
    const authHeader = ctx.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized: No token provided or invalid format' };
      return;
    }

    const [, token] = authHeader.split(' ');
    const user = verifyToken(token, accessSecret, options);

    if (!user) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden: Invalid or expired token' };
      return;
    }

    ctx.state.user = user;
    await next();
  };
}

/**
 * Koa middleware that requires a valid refresh token on every request it handles.
 * On success the decoded payload is set on `ctx.state.user`.
 *
 * @param refreshSecret - Secret used to verify refresh tokens.
 */
export function authenticateRefreshToken(
  refreshSecret: string,
  options?: VerifyTokenOptions,
) {
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
    const authHeader = ctx.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      ctx.status = 401;
      ctx.body = { message: 'Unauthorized: No token provided or invalid format' };
      return;
    }

    const [, token] = authHeader.split(' ');
    const user = verifyRefreshToken(token, refreshSecret, options);

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
