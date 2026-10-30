/**
 * Each middleware lazily requires its framework and must fail with a clear message
 * when the optional peer dependency is not installed.
 */
const cases: Array<[string, string, string, string[]]> = [
  [
    'express',
    '../src/middleware/express',
    'Express',
    ['authenticateToken', 'authenticateRefreshToken'],
  ],
  [
    'fastify',
    '../src/middleware/fastify',
    'Fastify',
    ['authenticateToken', 'authenticateRefreshToken'],
  ],
  [
    '@hapi/hapi',
    '../src/middleware/hapi',
    'Hapi',
    ['authenticateToken', 'authenticateRefreshToken'],
  ],
  [
    'koa',
    '../src/middleware/koa',
    'Koa',
    ['authenticateToken', 'authenticateRefreshToken'],
  ],
  ['next', '../src/middleware/next', 'Next.js', ['authenticateToken']],
  ['express', '../src/middleware/rbac', 'RBAC', ['authorizeRoles']],
];

describe.each(cases)(
  'missing peer dependency %s (%s)',
  (peer, modulePath, label, exportNames) => {
    test.each(exportNames)(`${'❌'} %s throws a helpful error`, (exportName) => {
      jest.isolateModules(() => {
        jest.doMock(peer, () => {
          throw new Error(`Cannot find module '${peer}'`);
        });

        const mod = require(modulePath);
        const call = () =>
          exportName === 'authenticateToken' && label === 'Next.js'
            ? mod[exportName](jest.fn(), 'a', 'r')
            : mod[exportName]('secret');

        expect(call).toThrow(new RegExp(`${label}.*not installed`, 'i'));
      });
      jest.dontMock(peer);
    });
  },
);
