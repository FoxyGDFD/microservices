import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import {
  CreateUserRequest,
  GenerateTokensResponse,
  LoginRequest,
  RefreshTokensRequest,
} from 'libs/common/src/types';

export class LoginDto implements LoginRequest {
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsString()
  @ApiProperty()
  password: string;
}

export class RegisterUserDto implements CreateUserRequest {
  @IsString()
  @ApiProperty()
  name: string;
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsStrongPassword()
  @ApiProperty()
  password: string;
}

export class RefreshTokenDto implements RefreshTokensRequest {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}

export class TokensDto implements GenerateTokensResponse {
  @IsString()
  @ApiProperty()
  refreshToken: string;
  @IsString()
  @ApiProperty()
  accessToken: string;
}
