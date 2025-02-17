import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, verifyRefreshToken } from '../jwt';

declare module 'fastify' {
  interface FastifyRequest {
    user?: any;
  }
}

export function authenticateToken(accessSecret: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyToken(token, accessSecret);

    if (!user) {
      return reply.status(403).send({ message: 'Forbidden: Invalid token' });
    }

    request.user = user;
  };
}

export function authenticateRefreshToken(refreshSecret: string) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const user = verifyRefreshToken(token, refreshSecret);

    if (!user) {
      return reply.status(403).send({ message: 'Forbidden: Invalid refresh token' });
    }

    request.user = user;
  };
}
