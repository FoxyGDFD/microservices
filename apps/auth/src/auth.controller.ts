import { Controller, Get, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  CreateUserRequest,
  GenerateTokensRequest,
  GenerateTokensResponse,
  RefreshTokensRequest,
  ValidateAccessTokenRequest,
  ValidateAccessTokenResponse,
} from '@app/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';

@Controller()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(createUserDto: CreateUserRequest) {
    try {
      const tokens = await this.authService.register(createUserDto);
      return tokens;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AuthService', 'Login')
  async login(login: GenerateTokensRequest): Promise<GenerateTokensResponse> {
    try {
      const tokens = await this.authService.login(login.email, login.password);
      return tokens;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AuthService', 'ValidateAccessToken')
  async validateAccessToken({
    token,
  }: ValidateAccessTokenRequest): Promise<ValidateAccessTokenResponse> {
    try {
      return await this.authService.validateAccessToken(token);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @GrpcMethod('AuthService', 'RefreshTokens')
  async refreshTokens(
    refreshTokensRequest: RefreshTokensRequest,
  ): Promise<GenerateTokensResponse> {
    try {
      return this.authService.refreshTokens(refreshTokensRequest);
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
