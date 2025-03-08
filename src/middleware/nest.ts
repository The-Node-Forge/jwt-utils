/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

let NestJsCommon: any;
let verifyToken: any;
let verifyRefreshToken: any;

try {
  NestJsCommon = require('@nestjs/common');
} catch (error) {
  throw new Error(
    "NestJS middleware is being used, but '@nestjs/common' is not installed. Please install it as a peer dependency.",
  );
}

import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export class AuthenticateToken implements CanActivate {
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string,
  ) {
    if (!verifyToken) {
      ({ verifyToken } = require('../jwt'));
    }
    if (!verifyRefreshToken) {
      ({ verifyRefreshToken } = require('../jwt'));
    }
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Unauthorized: No token provided or invalid format',
      );
    }

    const [, token] = authHeader.split(' ');
    let decoded;

    if (request.url.includes('/refresh')) {
      decoded = verifyRefreshToken(token, this.refreshSecret);
    } else {
      decoded = verifyToken(token, this.accessSecret);
    }

    if (!decoded) {
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }

    request.user = decoded;
    return true;
  }
}
