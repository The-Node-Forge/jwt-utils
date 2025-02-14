let fastify: any;

try {
  fastify = require('fastify');
} catch (err) {
  throw new Error(
    'Fastify is not installed. Please install it with: npm install fastify',
  );
}

import { FastifyPluginCallback } from 'fastify';
import { verifyToken } from '../jwt';

const authenticateToken: FastifyPluginCallback = (fastify, _options, done) => {
  fastify.addHook('onRequest', (request, reply, done) => {
    const token = request.headers.authorization?.split(' ')[1];
    if (token) {
      const user = verifyToken(token);
      if (user) {
        (request as any).user = user;
      }
    }
    done();
  });

  done();
};

export default authenticateToken;
