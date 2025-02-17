import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { verifyToken, verifyRefreshToken } from '../jwt';

@Injectable()
export class AuthenticateToken implements CanActivate {
  constructor(
    private readonly accessSecret: string,
    private readonly refreshSecret: string,
  ) {}

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
