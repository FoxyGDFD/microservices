import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  LoginDto,
  RegisterUserDto,
  TokensDto,
  RefreshTokenDto,
} from '@app/common';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: TokensDto })
  @Post('login')
  async login(@Body() request: LoginDto) {
    return await this.authService.login(request);
  }

  @ApiCreatedResponse({ type: TokensDto })
  @Post('register')
  async register(@Body() request: RegisterUserDto) {
    return await this.authService.register(request);
  }

  @ApiOkResponse({ type: TokensDto })
  @Post('refresh')
  async refreshTokens(@Body() request: RefreshTokenDto) {
    return await this.authService.refreshTokens(request);
  }
}
