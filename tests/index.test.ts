import defaultExport, {
  generateTokens,
  verifyToken,
  verifyRefreshToken,
  expressAuth,
  fastifyAuth,
  koaAuth,
  hapiAuth,
  nextAuth,
  nestAuth,
  rbacAuth,
} from '../src/index';
import * as jwtModule from '../src/jwt';
import * as express from '../src/middleware/express';
import * as fastify from '../src/middleware/fastify';
import * as koa from '../src/middleware/koa';
import * as hapi from '../src/middleware/hapi';
import * as next from '../src/middleware/next';
import * as nest from '../src/middleware/nest';
import * as rbac from '../src/middleware/rbac';

describe('package entry point', () => {
  test('re-exports the token helpers', () => {
    expect(generateTokens).toBe(jwtModule.generateTokens);
    expect(verifyToken).toBe(jwtModule.verifyToken);
    expect(verifyRefreshToken).toBe(jwtModule.verifyRefreshToken);
  });

  test.each([
    ['expressAuth', expressAuth, express.authenticateToken],
    ['fastifyAuth', fastifyAuth, fastify.authenticateToken],
    ['koaAuth', koaAuth, koa.authenticateToken],
    ['hapiAuth', hapiAuth, hapi.authenticateToken],
    ['nextAuth', nextAuth, next.authenticateToken],
    ['nestAuth', nestAuth, nest.AuthenticateToken],
    ['rbacAuth', rbacAuth, rbac.authorizeRoles],
  ])('%s lazily resolves its middleware', (_name, loader, expected) => {
    expect(loader()).toBe(expected);
  });

  test('default export exposes every helper', () => {
    expect(Object.keys(defaultExport).sort()).toEqual(
      [
        'generateTokens',
        'verifyToken',
        'verifyRefreshToken',
        'expressAuth',
        'fastifyAuth',
        'koaAuth',
        'hapiAuth',
        'nextAuth',
        'nestAuth',
        'rbacAuth',
      ].sort(),
    );
  });
});
