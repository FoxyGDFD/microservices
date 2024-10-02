import { UserEntity, ListUsersResponse } from '@app/common';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Role } from '@app/common/types';

@ApiTags('Users')
@ApiBearerAuth('Authorization')
@UseGuards(JwtGuard, RoleGuard(Role.ADMIN, Role.EDITOR))
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: UserEntity })
  @Get('/:id')
  getUser(@Param('id') id: string): Observable<UserEntity> {
    return this.userService.getUser({ id });
  }

  @ApiOkResponse({ type: UserEntity })
  @Get()
  listUsers(
    @Query('limit') limit,
    @Query('offset') offset,
  ): Observable<ListUsersResponse> {
    return this.userService.listUsers({ limit, offset });
  }
}
