import jwt from 'jsonwebtoken';

import { generateTokens } from '../src/jwt';
import * as express from '../src/middleware/express';
import * as fastify from '../src/middleware/fastify';
import * as hapi from '../src/middleware/hapi';
import * as koa from '../src/middleware/koa';
import * as next from '../src/middleware/next';
import { AuthenticateToken } from '../src/middleware/nest';
import { authorizeRoles } from '../src/middleware/rbac';

const ACCESS = 'test-access-secret';
const REFRESH = 'test-refresh-secret';
const payload = { id: 'user1', role: 'admin' };
const { accessToken, refreshToken } = generateTokens(payload, ACCESS, REFRESH);

const expired = jwt.sign(payload, ACCESS, {
  expiresIn: -10,
  audience: 'my-app',
  issuer: 'auth-service',
});
const tampered = `${accessToken.slice(0, -4)}AAAA`;
const notYetValid = jwt.sign(payload, ACCESS, { notBefore: 3600 });

// Headers that must be rejected as "no usable bearer token" (401).
const malformedHeaders: Array<[string, string | undefined]> = [
  ['missing header', undefined],
  ['empty header', ''],
  ['Basic scheme', 'Basic dXNlcjpwYXNz'],
  ['raw token without scheme', accessToken],
  ['lowercase scheme', `bearer ${accessToken}`],
];

// Tokens that carry a Bearer header but must be rejected as invalid (403/401).
const badTokens: Array<[string, string]> = [
  ['expired token', expired],
  ['tampered signature', tampered],
  ['token not yet valid (nbf)', notYetValid],
  ['refresh token on access route', refreshToken],
  ['garbage', 'not.a.jwt'],
  ['empty token', ''],
];

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe('Express edge cases', () => {
  const run = (mw: any, authorization?: string) => {
    const req: any = {
      headers: authorization === undefined ? {} : { authorization },
    };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const nextFn = jest.fn();
    mw(req, res, nextFn);
    return { req, res, nextFn };
  };

  test.each(malformedHeaders)('❌ access: %s -> 401', (_name, header) => {
    const { res, nextFn } = run(express.authenticateToken(ACCESS), header);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test.each(malformedHeaders)('❌ refresh: %s -> 401', (_name, header) => {
    const { res, nextFn } = run(
      express.authenticateRefreshToken(REFRESH),
      header === accessToken ? refreshToken : header,
    );
    expect(res.status).toHaveBeenCalledWith(401);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test.each(badTokens)('❌ access: %s -> 403', (_name, token) => {
    const { res, nextFn, req } = run(
      express.authenticateToken(ACCESS),
      `Bearer ${token}`,
    );
    expect(res.status).toHaveBeenCalledWith(403);
    expect(nextFn).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  test('❌ refresh: access token is rejected on the refresh middleware', () => {
    const { res, nextFn } = run(
      express.authenticateRefreshToken(REFRESH),
      `Bearer ${accessToken}`,
    );
    expect(res.status).toHaveBeenCalledWith(403);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test('❌ refresh: expired refresh token -> 403', () => {
    const old = jwt.sign(payload, REFRESH, { expiresIn: -10 });
    const { res, nextFn } = run(
      express.authenticateRefreshToken(REFRESH),
      `Bearer ${old}`,
    );
    expect(res.status).toHaveBeenCalledWith(403);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test('✅ refresh: valid refresh token calls next and sets req.user', () => {
    const { req, nextFn } = run(
      express.authenticateRefreshToken(REFRESH),
      `Bearer ${refreshToken}`,
    );
    expect(nextFn).toHaveBeenCalledTimes(1);
    expect(req.user).toMatchObject(payload);
  });
});

describe('Fastify edge cases', () => {
  const run = async (hook: any, authorization?: string) => {
    const request: any = {
      headers: authorization === undefined ? {} : { authorization },
    };
    const reply: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    await hook(request, reply);
    return { request, reply };
  };

  test.each(malformedHeaders)('❌ access: %s -> 401', async (_name, header) => {
    const { reply, request } = await run(fastify.authenticateToken(ACCESS), header);
    expect(reply.status).toHaveBeenCalledWith(401);
    expect(request.user).toBeUndefined();
  });

  test.each(malformedHeaders)('❌ refresh: %s -> 401', async (_name, header) => {
    const { reply } = await run(
      fastify.authenticateRefreshToken(REFRESH),
      header === accessToken ? refreshToken : header,
    );
    expect(reply.status).toHaveBeenCalledWith(401);
  });

  test.each(badTokens)('❌ access: %s -> 403', async (_name, token) => {
    const { reply, request } = await run(
      fastify.authenticateToken(ACCESS),
      `Bearer ${token}`,
    );
    expect(reply.status).toHaveBeenCalledWith(403);
    expect(request.user).toBeUndefined();
  });

  test('❌ refresh: access token -> 403', async () => {
    const { reply } = await run(
      fastify.authenticateRefreshToken(REFRESH),
      `Bearer ${accessToken}`,
    );
    expect(reply.status).toHaveBeenCalledWith(403);
  });
});

describe('Hapi edge cases', () => {
  const CONTINUE = Symbol('continue');
  const run = async (hook: any, authorization?: string | string[]) => {
    const request: any = {
      headers: authorization === undefined ? {} : { authorization },
      app: {},
    };
    const code = jest.fn().mockReturnValue('response');
    const response = jest.fn().mockReturnValue({ code });
    const h: any = { response, continue: CONTINUE };
    const result = await hook(request, h);
    return { request, response, code, result };
  };

  test.each(malformedHeaders)('❌ access: %s -> 401', async (_name, header) => {
    const { code, request } = await run(hapi.authenticateToken(ACCESS), header);
    expect(code).toHaveBeenCalledWith(401);
    expect(request.app.user).toBeUndefined();
  });

  test.each(malformedHeaders)('❌ refresh: %s -> 401', async (_name, header) => {
    const { code } = await run(
      hapi.authenticateRefreshToken(REFRESH),
      header === accessToken ? refreshToken : header,
    );
    expect(code).toHaveBeenCalledWith(401);
  });

  test.each(['Bearer', 'Bearer '])('❌ %j with no token -> 401', async (header) => {
    const access = await run(hapi.authenticateToken(ACCESS), header);
    expect(access.code).toHaveBeenCalledWith(401);
    const refresh = await run(hapi.authenticateRefreshToken(REFRESH), header);
    expect(refresh.code).toHaveBeenCalledWith(401);
  });

  test.each(badTokens.filter(([name]) => name !== 'empty token'))(
    '❌ access: %s -> 403',
    async (_name, token) => {
      const { code, request } = await run(
        hapi.authenticateToken(ACCESS),
        `Bearer ${token}`,
      );
      expect(code).toHaveBeenCalledWith(403);
      expect(request.app.user).toBeUndefined();
    },
  );

  test('❌ refresh: access token -> 403', async () => {
    const { code } = await run(
      hapi.authenticateRefreshToken(REFRESH),
      `Bearer ${accessToken}`,
    );
    expect(code).toHaveBeenCalledWith(403);
  });

  test('✅ uses the first value when the authorization header is an array', async () => {
    const { result, request } = await run(hapi.authenticateToken(ACCESS), [
      `Bearer ${accessToken}`,
      'Bearer other',
    ]);
    expect(result).toBe(CONTINUE);
    expect(request.app.user).toMatchObject(payload);
  });
});

describe('Hapi refresh edge cases', () => {
  test('✅ uses the first value when the refresh authorization header is an array', async () => {
    const request: any = {
      headers: { authorization: [`Bearer ${refreshToken}`, 'Bearer other'] },
      app: {},
    };
    const CONTINUE = Symbol('continue');
    const h: any = { response: jest.fn(), continue: CONTINUE };

    const result = await hapi.authenticateRefreshToken(REFRESH)(request, h);

    expect(result).toBe(CONTINUE);
    expect(request.app.user).toMatchObject(payload);
  });
});

describe('Koa edge cases', () => {
  const run = async (mw: any, path: string, authorization?: string) => {
    const ctx: any = {
      path,
      headers: authorization === undefined ? {} : { authorization },
      state: {},
    };
    const nextFn = jest.fn().mockResolvedValue(undefined);
    await mw(ctx, nextFn);
    return { ctx, nextFn };
  };

  test.each(malformedHeaders)('❌ access: %s -> 401', async (_name, header) => {
    const { ctx, nextFn } = await run(
      koa.authenticateToken(ACCESS),
      '/protected',
      header,
    );
    expect(ctx.status).toBe(401);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test.each(malformedHeaders)('❌ refresh: %s -> 401', async (_name, header) => {
    const { ctx, nextFn } = await run(
      koa.authenticateRefreshToken(REFRESH),
      '/refresh',
      header === accessToken ? refreshToken : header,
    );
    expect(ctx.status).toBe(401);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test.each(badTokens)('❌ access: %s -> 403', async (_name, token) => {
    const { ctx, nextFn } = await run(
      koa.authenticateToken(ACCESS),
      '/protected',
      `Bearer ${token}`,
    );
    expect(ctx.status).toBe(403);
    expect(nextFn).not.toHaveBeenCalled();
    expect(ctx.state.user).toBeUndefined();
  });

  test('❌ refresh: access token -> 403', async () => {
    const { ctx, nextFn } = await run(
      koa.authenticateRefreshToken(REFRESH),
      '/refresh',
      `Bearer ${accessToken}`,
    );
    expect(ctx.status).toBe(403);
    expect(nextFn).not.toHaveBeenCalled();
  });
});

describe('Next.js edge cases', () => {
  const run = (allowRefresh: boolean, authorization?: string) => {
    const handler = jest.fn();
    const mw = next.authenticateToken(handler, ACCESS, REFRESH, allowRefresh);
    const req: any = {
      headers: authorization === undefined ? {} : { authorization },
    };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    mw(req, res);
    return { handler, res, req };
  };

  test.each(malformedHeaders)('❌ %s -> 401', (_name, header) => {
    const { handler, res } = run(false, header);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(handler).not.toHaveBeenCalled();
  });

  test.each(badTokens)('❌ access mode: %s -> 401', (_name, token) => {
    const { handler, res, req } = run(false, `Bearer ${token}`);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(handler).not.toHaveBeenCalled();
    expect(req.user).toBeUndefined();
  });

  test('❌ refresh mode rejects an access token', () => {
    const { handler, res } = run(true, `Bearer ${accessToken}`);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('NestJS guard edge cases', () => {
  const ctxFor = (authorization?: string, url = '/protected') =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          url,
          headers: authorization === undefined ? {} : { authorization },
        }),
      }),
    }) as any;

  const guard = new AuthenticateToken(ACCESS, REFRESH);

  test.each(malformedHeaders)('❌ %s -> throws', (_name, header) => {
    expect(() => guard.canActivate(ctxFor(header))).toThrow();
  });

  test.each(badTokens)('❌ %s -> throws', (_name, token) => {
    expect(() => guard.canActivate(ctxFor(`Bearer ${token}`))).toThrow();
  });
});

describe('RBAC edge cases', () => {
  const run = (user: any, ...roles: string[]) => {
    const req: any = { user };
    const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const nextFn = jest.fn();
    authorizeRoles(...roles)(req, res, nextFn);
    return { res, nextFn };
  };

  test('❌ denies everyone when no roles are allowed (fails closed)', () => {
    const { res, nextFn } = run({ id: '1', role: 'admin' });
    expect(res.status).toHaveBeenCalledWith(403);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test('❌ denies a user without a role claim', () => {
    const { res, nextFn } = run({ id: '1' }, 'admin');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test('❌ denies when the decoded token is a plain string payload', () => {
    const { res, nextFn } = run('just-a-string', 'admin');
    expect(res.status).toHaveBeenCalledWith(403);
    expect(nextFn).not.toHaveBeenCalled();
  });

  test('❌ role matching is case-sensitive and exact', () => {
    const { res } = run({ id: '1', role: 'Admin' }, 'admin');
    expect(res.status).toHaveBeenCalledWith(403);
  });
});
