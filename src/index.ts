import { generateTokens, verifyToken, verifyRefreshToken } from './jwt';
import { authenticateToken as hapiAuth } from './middleware/hapi';
import { authenticateToken as nextAuth } from './middleware/next';
import { AuthenticateToken as nestAuth } from './middleware/nest';
import { authorizeRoles as rbacAuth } from './middleware/rbac';
import { authenticateToken as expressAuth } from './middleware/express';
import { authenticateToken as fastifyAuth } from './middleware/fastify';
import { authenticateToken as koaAuth } from './middleware/koa';

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
