import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  mixin,
  Type,
} from '@nestjs/common';
import { Role } from '@app/common/types';

export const RoleGuard = (...roles: Role[] | undefined): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      if (!roles.length) {
        return true;
      }
      const request = context.switchToHttp().getRequest();

      if (this.verifyRoles(roles, request.role)) return true;
      else throw new ForbiddenException('Permission denied');
    }

    private verifyRoles(requiredRoles: string[], userRoles: string): boolean {
      if (!userRoles) return false;
      return requiredRoles.some((role) => userRoles.includes(role));
    }
  }

  return mixin(RoleGuardMixin);
};
