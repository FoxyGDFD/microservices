import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const payload = await lastValueFrom(
        await this.authService.validateAccessToken({
          token,
        }),
      );
      request['user'] = payload.userId as string;
      request['role'] = payload.role as string;
      return payload.isValid;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (
        request.headers as Headers & { authorization?: string }
      ).authorization?.split(' ') ?? [];
    if (type === 'Bearer') return token;
    throw new UnauthorizedException(
      `Invalid token type. Expected 'Bearer' but got '${type}'`,
    );
  }
}
