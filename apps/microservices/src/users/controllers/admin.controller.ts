import {
  Controller,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Post,
} from '@nestjs/common';
import { UserEntity } from '@app/common';
import { Observable } from 'rxjs';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { UsersService } from '../users.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UpdateUserDto } from '@app/common/dto';
import { RoleGuard } from '../../auth/guards/role.guard';
import { Role } from '@app/common/types';

@ApiTags('Admin')
@UseGuards(JwtGuard, RoleGuard(Role.ADMIN))
@ApiBearerAuth('Authorization')
@Controller('admin/users')
export class AdminsController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: UserEntity })
  @Post()
  createUser(@Body() request: CreateUserDto): Observable<UserEntity> {
    return this.userService.createUser(request);
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
}
