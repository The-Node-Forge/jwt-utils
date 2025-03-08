/* eslint-disable @typescript-eslint/no-require-imports */

export { generateTokens, verifyToken, verifyRefreshToken } from './jwt.js';

export const expressAuth = () =>
  require('./middleware/express.js').authenticateToken;
export const fastifyAuth = () =>
  require('./middleware/fastify.js').authenticateToken;
export const koaAuth = () => require('./middleware/koa.js').authenticateToken;
export const hapiAuth = () => require('./middleware/hapi.js').authenticateToken;
export const nextAuth = () => require('./middleware/next.js').authenticateToken;
export const nestAuth = () => require('./middleware/nest.js').AuthenticateToken;
export const rbacAuth = () => require('./middleware/rbac.js').authorizeRoles;

export default {
  generateTokens: require('./jwt.js').generateTokens,
  verifyToken: require('./jwt.js').verifyToken,
  verifyRefreshToken: require('./jwt.js').verifyRefreshToken,
  expressAuth,
  fastifyAuth,
  koaAuth,
  hapiAuth,
  nextAuth,
  nestAuth,
  rbacAuth,
};
