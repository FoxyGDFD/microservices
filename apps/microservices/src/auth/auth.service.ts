import {
  AUTH_SERVICE_NAME,
  AuthServiceClient,
  CreateUserRequest,
  LoginRequest,
  RefreshTokensRequest,
  ValidateAccessTokenRequest,
  ValidateAccessTokenResponse,
} from '@app/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(@Inject(AUTH_SERVICE_NAME) private client: ClientGrpc) {}
  private grpcAuthService: AuthServiceClient;

  onModuleInit() {
    this.grpcAuthService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  async register(request: CreateUserRequest) {
    return this.grpcAuthService.register(request);
  }

  async login(request: LoginRequest) {
    return this.grpcAuthService.login(request);
  }

  async validateAccessToken(
    request: ValidateAccessTokenRequest,
  ): Promise<Observable<ValidateAccessTokenResponse>> {
    return await this.grpcAuthService.validateAccessToken(request);
  }
  async refreshTokens(request: RefreshTokensRequest) {
    return await this.grpcAuthService.refreshTokens(request);
  }
}
