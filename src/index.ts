import { generateTokens, verifyToken, verifyRefreshToken } from './jwt.js';
import { authenticateToken as hapiAuth } from './middleware/hapi.js';
import { authenticateToken as nextAuth } from './middleware/next.js';
import { AuthenticateToken as nestAuth } from './middleware/nest.js';
import { authorizeRoles as rbacAuth } from './middleware/rbac.js';
import { authenticateToken as expressAuth } from './middleware/express.js';
import { authenticateToken as fastifyAuth } from './middleware/fastify.js';
import { authenticateToken as koaAuth } from './middleware/koa.js';

export {
  generateTokens,
  verifyToken,
  verifyRefreshToken,
  hapiAuth,
  nextAuth,
  nestAuth,
  rbacAuth,
  expressAuth,
  fastifyAuth,
  koaAuth,
};

export default {
  generateTokens,
  verifyToken,
  verifyRefreshToken,
  hapiAuth,
  nextAuth,
  nestAuth,
  rbacAuth,
  expressAuth,
  fastifyAuth,
  koaAuth,
};
