import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { verifyToken } from '../jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const [, token] = authHeader.split(' ');
    const decoded = verifyToken(token);

    if (!decoded) {
      throw new ForbiddenException('Forbidden');
    }

    // attach user data to request
    request.user = decoded;
    return true;
  }
}
