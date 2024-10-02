import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
  Type,
} from '@nestjs/common';
import { logger } from '../../main';
import { Role } from '@app/common/types';

export const RoleGuard = (...roles: Role[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      if (!roles.length) {
        return true;
      }
      const request = context.switchToHttp().getRequest();

      logger.log('ROLE', roles, request.role);
      if (this.verifyRoles(roles, request.role)) return true;
      else throw new ForbiddenException('Permission denied');
    }

    private verifyRoles(requiredRoles: string[], userRoles: string): boolean {
      return requiredRoles.some((role) => userRoles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};
