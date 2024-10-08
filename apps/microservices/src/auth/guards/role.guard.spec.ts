import { RoleGuard } from './role.guard'; // Adjust the import to your path
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Role } from '@app/common/types'; // Adjust this path as well

describe('RoleGuard', () => {
  const mockExecutionContext = (role?: string) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          role: role || null, // Mock the role in the request
        }),
      }),
    } as ExecutionContext;
  };

  it('should allow access if no roles are specified', () => {
    const guard = new (RoleGuard())();
    const context = mockExecutionContext(Role.ADMIN);

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow access if user has one of the required roles', () => {
    const guard = new (RoleGuard(Role.ADMIN, Role.EDITOR))();
    const context = mockExecutionContext(Role.ADMIN); // User has Role.ADMIN role

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user does not have the required role', () => {
    const guard = new (RoleGuard(Role.ADMIN))();
    const context = mockExecutionContext(Role.VISITOR); // User has Role.VISITOR role, not Role.ADMIN

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  //   it('should allow access if user has multiple roles and one matches', () => {
  //     const guard = new (RoleGuard(Role.ADMIN))();
  //     const context = mockExecutionContext(Role.ADMIN, Role.VISITOR); // User has both Role.ADMIN and 'user' roles

  //     expect(guard.canActivate(context)).toBe(true);
  //   });

  it('should throw ForbiddenException if user role is empty', () => {
    const guard = new (RoleGuard(Role.ADMIN))();
    const context = mockExecutionContext(); // No role provided in the request

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
