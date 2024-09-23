import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthServiceController,
  GenerateTokensResponse,
  RefreshTokensRequest,
  ValidateAccessTokenRequest,
  ValidateAccessTokenResponse,
} from '@app/common';
import { GrpcMethod } from '@nestjs/microservices';
import { LoginDto, RegisterUserDto } from '@app/common/dto';

@Controller()
export class AuthController implements AuthServiceController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(createUserDto: RegisterUserDto) {
    const tokens = await this.authService.register(createUserDto);
    return tokens;
  }

  @GrpcMethod('AuthService', 'Login')
  async login(login: LoginDto): Promise<GenerateTokensResponse> {
    const tokens = await this.authService.login(login.email, login.password);
    return tokens;
  }

  @GrpcMethod('AuthService', 'ValidateAccessToken')
  async validateAccessToken({
    token,
  }: ValidateAccessTokenRequest): Promise<ValidateAccessTokenResponse> {
    return await this.authService.validateAccessToken(token);
  }

  @GrpcMethod('AuthService', 'RefreshTokens')
  async refreshTokens(
    refreshTokensRequest: RefreshTokensRequest,
  ): Promise<GenerateTokensResponse> {
    return this.authService.refreshTokens(refreshTokensRequest);
  }
}
