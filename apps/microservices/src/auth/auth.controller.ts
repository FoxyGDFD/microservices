import { Controller, Get, Post, Body, Req, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserRequest,
  GenerateTokensRequest,
  RefreshTokensRequest,
} from '@app/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body() request: GenerateTokensRequest) {
    return await this.authService.login(request);
  }

  @Post('new')
  register(@Body() request: CreateUserRequest) {
    Logger.log('register', request);
    return this.authService.register(request);
  }

  @Post('refresh')
  async refreshTokens(@Body() request: RefreshTokensRequest) {
    return await this.authService.refreshTokens(request);
  }
}
