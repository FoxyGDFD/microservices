import { UserEntity } from '@app/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { IdFromJwt } from '../../auth/id-from-jwt.decorator';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../auth/auth.guard';

@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
@Controller('me')
export class MeController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: UserEntity })
  @Get()
  getSelf(@IdFromJwt() id: string): Observable<UserEntity> {
    return this.userService.getUser({ id });
  }
}
