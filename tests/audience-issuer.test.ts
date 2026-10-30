import { generateTokens } from '../src/jwt';
import * as express from '../src/middleware/express';
import * as fastify from '../src/middleware/fastify';
import * as hapi from '../src/middleware/hapi';
import * as koa from '../src/middleware/koa';
import * as next from '../src/middleware/next';
import { AuthenticateToken } from '../src/middleware/nest';

const ACCESS = 'test-access-secret';
const REFRESH = 'test-refresh-secret';
const payload = { id: 'user1', role: 'admin' };
const expected = { audience: 'service-a', issuer: 'idp-1' };

const mint = (claims: { audience?: string; issuer?: string }) =>
  generateTokens(payload, ACCESS, REFRESH, claims);

const matching = mint(expected);
const otherAudience = mint({ ...expected, audience: 'service-b' });
const otherIssuer = mint({ ...expected, issuer: 'idp-2' });
// generateTokens falls back to my-app / auth-service when claims are omitted.
const defaults = mint({});

type Options = { audience?: string; issuer?: string } | undefined;
type Runner = (_token: string, _options: Options) => Promise<boolean>;

const bearer = (token: string) => `Bearer ${token}`;

const CONTINUE = Symbol('continue');

/** Each adapter reports whether the middleware let the request through. */
const adapters: Array<[string, { access: Runner; refresh: Runner }]> = [
  [
    'express',
    {
      access: async (token, options) => {
        const nextFn = jest.fn();
        const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        express.authenticateToken(ACCESS, options)(
          { headers: { authorization: bearer(token) } },
          res,
          nextFn,
        );
        return nextFn.mock.calls.length === 1;
      },
      refresh: async (token, options) => {
        const nextFn = jest.fn();
        const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        express.authenticateRefreshToken(REFRESH, options)(
          { headers: { authorization: bearer(token) } },
          res,
          nextFn,
        );
        return nextFn.mock.calls.length === 1;
      },
    },
  ],
  [
    'fastify',
    {
      access: async (token, options) => {
        const request: any = { headers: { authorization: bearer(token) } };
        const reply: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await fastify.authenticateToken(ACCESS, options)(request, reply);
        return request.user !== undefined;
      },
      refresh: async (token, options) => {
        const request: any = { headers: { authorization: bearer(token) } };
        const reply: any = { status: jest.fn().mockReturnThis(), send: jest.fn() };
        await fastify.authenticateRefreshToken(REFRESH, options)(request, reply);
        return request.user !== undefined;
      },
    },
  ],
  [
    'hapi',
    {
      access: async (token, options) => {
        const request: any = { headers: { authorization: bearer(token) }, app: {} };
        const h: any = {
          response: jest.fn().mockReturnValue({ code: jest.fn() }),
          continue: CONTINUE,
        };
        return (
          (await hapi.authenticateToken(ACCESS, options)(request, h)) === CONTINUE
        );
      },
      refresh: async (token, options) => {
        const request: any = { headers: { authorization: bearer(token) }, app: {} };
        const h: any = {
          response: jest.fn().mockReturnValue({ code: jest.fn() }),
          continue: CONTINUE,
        };
        return (
          (await hapi.authenticateRefreshToken(REFRESH, options)(request, h)) ===
          CONTINUE
        );
      },
    },
  ],
  [
    'koa',
    {
      access: async (token, options) => {
        const nextFn = jest.fn().mockResolvedValue(undefined);
        const ctx: any = {
          path: '/protected',
          headers: { authorization: bearer(token) },
          state: {},
        };
        await koa.authenticateToken(ACCESS, options)(ctx, nextFn);
        return nextFn.mock.calls.length === 1;
      },
      refresh: async (token, options) => {
        const nextFn = jest.fn().mockResolvedValue(undefined);
        const ctx: any = {
          path: '/refresh',
          headers: { authorization: bearer(token) },
          state: {},
        };
        await koa.authenticateRefreshToken(REFRESH, options)(ctx, nextFn);
        return nextFn.mock.calls.length === 1;
      },
    },
  ],
  [
    'next',
    {
      access: async (token, options) => {
        const handler = jest.fn();
        const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next.authenticateToken(
          handler,
          ACCESS,
          REFRESH,
          false,
          options,
        )({ headers: { authorization: bearer(token) } }, res);
        return handler.mock.calls.length === 1;
      },
      refresh: async (token, options) => {
        const handler = jest.fn();
        const res: any = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next.authenticateToken(
          handler,
          ACCESS,
          REFRESH,
          true,
          options,
        )({ headers: { authorization: bearer(token) } }, res);
        return handler.mock.calls.length === 1;
      },
    },
  ],
  [
    'nest',
    {
      access: async (token, options) => {
        const request = { headers: { authorization: bearer(token) }, url: '/x' };
        const ctx: any = { switchToHttp: () => ({ getRequest: () => request }) };
        try {
          return new AuthenticateToken(ACCESS, REFRESH, false, options).canActivate(
            ctx,
          );
        } catch {
          return false;
        }
      },
      refresh: async (token, options) => {
        const request = { headers: { authorization: bearer(token) }, url: '/x' };
        const ctx: any = { switchToHttp: () => ({ getRequest: () => request }) };
        try {
          return new AuthenticateToken(ACCESS, REFRESH, true, options).canActivate(
            ctx,
          );
        } catch {
          return false;
        }
      },
    },
  ],
];

beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe.each(adapters)('%s: audience / issuer options', (_name, run) => {
  describe.each([
    ['access', 'accessToken', run.access],
    ['refresh', 'refreshToken', run.refresh],
  ] as const)('%s token', (_kind, key, runner) => {
    test('✅ accepts a token with the expected audience and issuer', async () => {
      expect(await runner(matching[key], expected)).toBe(true);
    });

    test('✅ accepts when only audience is required and it matches', async () => {
      expect(await runner(matching[key], { audience: expected.audience })).toBe(
        true,
      );
    });

    test('✅ accepts when only issuer is required and it matches', async () => {
      expect(await runner(matching[key], { issuer: expected.issuer })).toBe(true);
    });

    test('❌ rejects a token minted for a different audience', async () => {
      expect(await runner(otherAudience[key], expected)).toBe(false);
    });

    test('❌ rejects a token from a different issuer', async () => {
      expect(await runner(otherIssuer[key], expected)).toBe(false);
    });

    test('❌ rejects default-claim tokens when specific claims are required', async () => {
      expect(await runner(defaults[key], expected)).toBe(false);
    });

    test('✅ without options, claims are not enforced (backwards compatible)', async () => {
      expect(await runner(otherAudience[key], undefined)).toBe(true);
      expect(await runner(defaults[key], undefined)).toBe(true);
    });
  });
});
