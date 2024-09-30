import { UserEntity } from '@app/common';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { IdFromJwt } from '../../auth/id-from-jwt.decorator';
import { UsersService } from '../users.service';
import { AuthGuard } from '../../auth/auth.guard';
import { Observable } from 'rxjs';

@ApiTags('User')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
@Controller('me')
export class MeController {
  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({ type: UserEntity })
  @Get()
  getSelf(@IdFromJwt() id: string): Observable<UserEntity> {
    return this.userService.getUser({ id });
  }
}
