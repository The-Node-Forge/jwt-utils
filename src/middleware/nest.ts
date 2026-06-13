/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

let verifyToken: any;
let verifyRefreshToken: any;

export class AuthenticateToken implements CanActivate {
  constructor(
    private readonly _accessSecret: string,
    private readonly _refreshSecret: string,
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
      decoded = verifyRefreshToken(token, this._refreshSecret);
    } else {
      decoded = verifyToken(token, this._accessSecret);
    }

    if (!decoded) {
      throw new UnauthorizedException('Unauthorized: Invalid or expired token');
    }

    request.user = decoded;
    return true;
  }
}
