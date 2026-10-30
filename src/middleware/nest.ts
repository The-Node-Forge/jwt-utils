/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */

import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

let verifyToken: any;
let verifyRefreshToken: any;

/**
 * NestJS guard that validates a Bearer token and attaches the decoded payload to
 * `request.user`.
 *
 * By default only access tokens are accepted. Pass `allowRefreshToken = true`
 * when guarding a refresh route (e.g. `new AuthenticateToken(a, r, true)`) to
 * accept refresh tokens there instead. The token type is never inferred from the
 * request URL.
 *
 * @param _accessSecret - Secret used to verify access tokens.
 * @param _refreshSecret - Secret used to verify refresh tokens.
 * @param _allowRefreshToken - Verify the token as a refresh token instead.
 */
export class AuthenticateToken implements CanActivate {
  constructor(
    private readonly _accessSecret: string,
    private readonly _refreshSecret: string,
    private readonly _allowRefreshToken: boolean = false,
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

    if (this._allowRefreshToken) {
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
