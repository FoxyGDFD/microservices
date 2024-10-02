import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID } from 'class-validator';
import { User as UserType } from 'libs/common/src/types';

export class UserEntity implements UserType {
  @ApiProperty()
  @IsString()
  @IsUUID()
  id: string;
  @ApiProperty()
  @IsString()
  name: string;
  @ApiProperty({ format: 'email' })
  @IsEmail()
  email: string;
}
