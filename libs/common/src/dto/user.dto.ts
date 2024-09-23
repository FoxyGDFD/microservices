import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { UpdateUserRequest } from 'libs/common/src/types';

export class UpdateUserDto implements Omit<UpdateUserRequest, 'id'> {
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
