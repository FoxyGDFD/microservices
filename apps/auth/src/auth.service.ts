import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  CreateUserRequest,
  RefreshTokensRequest,
  ValidateAccessTokenResponse,
} from '@app/common';
import { UserService } from './user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserRequest) {
    const user = await this.userService.getUser({ email: createUserDto.email });
    if (!!user) {
      throw new BadRequestException('Email already in use');
    }
    const newUser = await this.userService.createUser(createUserDto);
    Logger.log('newUser', newUser);
    return await this.generateTokens(newUser.id);
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    return await this.generateTokens(user.id);
  }

  private async generateTokens(id: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: id },
      { expiresIn: '15m' }, // Access token valid for 15 minutes
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: id, type: 'refresh' },
      { expiresIn: '7d' }, // Refresh token valid for 7 days
    );

    return { accessToken, refreshToken };
  }

  async validateAccessToken(
    token: string,
  ): Promise<ValidateAccessTokenResponse> {
    try {
      const decoded = await this.jwtService.verifyAsync(token);
      if (decoded.exp * 1000 < Date.now())
        throw new UnauthorizedException('Expired access token');

      return {
        isValid: decoded.exp * 1000 < Date.now(),
        userId: decoded.sub as string,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async validateRefreshToken(refreshToken: string) {
    const decoded = await this.jwtService.verifyAsync(refreshToken);
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedException('Invalid token type');
    }
    if (decoded.exp * 1000 < Date.now())
      throw new UnauthorizedException('Expired refresh token');

    return {
      idValid: decoded.exp * 1000 < Date.now(),
      userId: decoded.sub as string,
    };
  }

  async refreshTokens(refreshTokensRequest: RefreshTokensRequest) {
    const { userId } = await this.validateRefreshToken(
      refreshTokensRequest.refreshToken,
    );
    return this.generateTokens(userId);
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.getUser({ email });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    return user;
  }
}
