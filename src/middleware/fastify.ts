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
  console.log('🔹 Middleware processing request...');
  console.log(
    '🔹 Received Authorization Header:',
    request.headers.authorization || 'None',
  );

  const authHeader = request.headers.authorization;
  if (!authHeader) {
    console.log('❌ No authorization header received');
    return reply.status(401).send({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔹 Extracted token:', token || 'No token extracted');

  if (!token) {
    console.log('❌ Invalid token format');
    return reply.status(401).send({ message: 'Unauthorized: Invalid token format' });
  }

  const user = verifyToken(token);
  console.log('🔹 Decoded user:', user || 'No user decoded');

  if (!user) {
    console.log('❌ Token verification failed');
    return reply.status(403).send({ message: 'Forbidden: Invalid token' });
  }

  (request as any).user = user;
  console.log('✅ User set in request:', request.user);
}
export default authenticateToken;
