let fastify: any;

try {
  fastify = require('fastify');
} catch (err) {
  throw new Error(
    'Fastify is not installed. Please install it with: npm install fastify',
  );
}

import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken } from '../jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user?: any;
  }
}

export async function authenticateToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    return reply.status(401).send({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return reply.status(401).send({ message: 'Unauthorized: Invalid token format' });
  }

  const user = verifyToken(token);

  if (!user) {
    return reply.status(403).send({ message: 'Forbidden: Invalid token' });
  }

  (request as any).user = user;
}
export default authenticateToken;
