import { UpdateSelfDto, UpdateUserDto, UserEntity } from '@app/common';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IdFromJwt } from '../../auth/decorators/id-from-jwt.decorator';
import { UsersService } from '../users.service';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { Observable } from 'rxjs';

@ApiTags('Self')
@ApiBearerAuth('Authorization')
@UseGuards(JwtGuard)
@Controller('me')
export class MeController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: UserEntity })
  @Get()
  getSelf(@IdFromJwt() id: string): Observable<UserEntity> {
    return this.userService.getUser({ id });
  }

  @ApiOkResponse({ type: UserEntity })
  @Patch()
  updateUser(
    @IdFromJwt() id: string,
    @Body() request: UpdateSelfDto,
  ): Observable<UserEntity> {
    return this.userService.updateUser({ id, ...request });
  }
  @ApiOkResponse({ type: UserEntity })
  @Delete()
  deleteSelf(@IdFromJwt() id: string): Observable<UserEntity> {
    return this.userService.deleteUser({ id });
  }
}
