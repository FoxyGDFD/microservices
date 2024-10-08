import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Custom decorator to extract the user ID from the JWT token payload.
 *
 * This decorator retrieves the `user` - user id from the request, which
 * is typically attached by authentication middleware/quard or some else.
 *
 * ## Example
 *
 * ```typescript
 * @Controller('users')
 * export class UsersController {
 *   @Get('profile')
 *   getProfile(@IdFromJwt() user: any) {
 *     return user; // Contains user id information from the JWT token
 *   }
 * }
 * ```
 *
 * @param _data Not used in this case, but can be any additional data passed to the decorator.
 * @param context Provides execution context which includes the HTTP request.
 * @returns The user id string attached to the request by the authentication middleware.
 */
export const IdFromJwt = createParamDecorator(
  (_data, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
