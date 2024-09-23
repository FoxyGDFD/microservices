import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ValidateAccessTokenResponse } from '@app/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
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
      request['user'] = payload.userId;
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
    return type === 'Bearer' ? token : undefined;
  }
}
