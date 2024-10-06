import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import {
  CreateUserRequest,
  Role,
  UpdateUserRequest,
} from 'libs/common/src/types';

export class UpdateUserDto implements Omit<UpdateUserRequest, 'id'> {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name?: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({ format: 'email', required: false })
  email?: string;
  @IsOptional()
  @IsStrongPassword()
  @ApiProperty({ required: false })
  password?: string;
  @IsOptional()
  @IsEnum(Role)
  @ApiProperty({ enum: Object.keys(Role), required: false })
  role?: Role;
}

export class UpdateSelfDto implements Omit<UpdateUserRequest, 'id' | 'role'> {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  name?: string;
  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiProperty({ format: 'email', required: false })
  email?: string;
  @IsOptional()
  @IsStrongPassword()
  @ApiProperty({ required: false })
  password?: string;
}

export class CreateUserDto implements CreateUserRequest {
  @IsString()
  @ApiProperty()
  name: string;
  @IsString()
  @IsEmail()
  @ApiProperty({ format: 'email' })
  email: string;
  @IsStrongPassword()
  @ApiProperty()
  password: string;
  @IsOptional()
  @IsEnum(Role, { each: true })
  @ApiProperty({ enum: Object.keys(Role), required: false })
  role?: Role;
}
