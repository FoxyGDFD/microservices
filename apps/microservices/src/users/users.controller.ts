import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ListUsersResponse, UserEntity } from '@app/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '@app/common/dto';

@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: UserEntity })
  @Get('/:id')
  getUser(@Param('id') id: string): Observable<UserEntity> {
    return this.userService.getUser({ id });
  }

  @ApiOkResponse({ type: UserEntity })
  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() request: UpdateUserDto,
  ): Observable<UserEntity> {
    return this.userService.updateUser({ id, ...request });
  }
  @ApiOkResponse({ type: UserEntity })
  @Delete('/:id')
  deleteUser(@Param('id') id: string): Observable<UserEntity> {
    return this.userService.deleteUser({ id });
  }

  @ApiOkResponse({ type: UserEntity })
  @Get()
  listUsers(): Observable<ListUsersResponse> {
    return this.userService.listUsers({});
  }
}
