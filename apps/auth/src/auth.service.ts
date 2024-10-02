import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserRequest,
  RefreshTokensRequest,
  ValidateAccessTokenResponse,
} from '@app/common';
import { UserService } from './user/user.service';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserRequest) {
    const user = await this.userService.getUser({
      email: createUserDto.email,
    });
    if (!!user) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'Email already registered',
      });
    }
    const newUser = await this.userService.createUser(createUserDto);
    return await this.generateTokens(newUser.id, newUser.role);
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return await this.generateTokens(user.id, user.role);
  }

  private async generateTokens(id: string, role: string) {
    const accessToken = this.jwtService.sign({ sub: id, role });

    const refreshToken = this.jwtService.sign(
      { sub: id, type: 'refresh', role },
      {
        expiresIn: '10d',
        secret: this.configService.get<string>('REFRESH_SECRET'),
      }, // Refresh token valid for 7 days
    );

    return { accessToken, refreshToken };
  }

  async validateAccessToken(
    token: string,
  ): Promise<ValidateAccessTokenResponse> {
    try {
      const decoded = this.jwtService.verify(token);

      const isExpired = decoded.exp * 1000 < Date.now();
      if (isExpired)
        throw new RpcException({
          code: status.UNAUTHENTICATED,
          message: 'Expired access token',
        });

      return {
        isValid: !isExpired,
        userId: decoded.sub as string,
        role: decoded.role,
      };
    } catch (error) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Invalid access token',
      });
    }
  }

  async validateRefreshToken(refreshToken: string) {
    const decoded = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
    });
    if (decoded.type !== 'refresh') {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Invalid token type',
      });
    }
    const isExpired = decoded.exp * 1000 < Date.now();
    if (isExpired)
      throw new RpcException({
        code: status.UNAUTHENTICATED,
        message: 'Expired access token',
      });

    return {
      isValid: !isExpired,
      userId: decoded.sub,
      role: decoded.role,
    };
  }

  async refreshTokens(refreshTokensRequest: RefreshTokensRequest) {
    const { userId, role } = await this.validateRefreshToken(
      refreshTokensRequest.refreshToken,
    );
    return this.generateTokens(userId, role);
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.getUser({ email });
    if (!user) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Invalid credentials',
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Invalid credentials',
      });
    }
    return user;
  }
}
