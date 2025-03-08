/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

import type { FastifyRequest } from 'fastify';

let fastify: any;
let verifyToken: any;
let verifyRefreshToken: any;

declare module 'fastify' {
  interface FastifyRequest {
    user?: any;
  }
}

export function authenticateToken(accessSecret: string) {
  if (!fastify) {
    try {
      fastify = require('fastify');
    } catch (error) {
      throw new Error(
        "Fastify middleware is being used, but 'fastify' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyToken) {
    ({ verifyToken } = require('../jwt'));
  }

  return async (request: FastifyRequest, reply: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Unauthorized: No token provided' });
    }

    const [, token] = authHeader.split(' ');
    const user = verifyToken(token, accessSecret);

    if (!user) {
      return reply.status(403).send({ message: 'Forbidden: Invalid token' });
    }

    request.user = user;
  };
}

export function authenticateRefreshToken(refreshSecret: string) {
  if (!fastify) {
    try {
      fastify = require('fastify');
    } catch (error) {
      throw new Error(
        "Fastify middleware is being used, but 'fastify' is not installed. Please install it as a peer dependency.",
      );
    }
  }

  if (!verifyRefreshToken) {
    ({ verifyRefreshToken } = require('../jwt'));
  }

  return async (request: FastifyRequest, reply: any) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return reply.status(401).send({ message: 'Unauthorized: No token provided' });
    }

    const [, token] = authHeader.split(' ');
    const user = verifyRefreshToken(token, refreshSecret);

    if (!user) {
      return reply.status(403).send({ message: 'Forbidden: Invalid refresh token' });
    }

    request.user = user;
  };
}
