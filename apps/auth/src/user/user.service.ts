import { CreateUserRequest, UpdateUserRequest } from '@app/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserRequest): Promise<User> {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: this.encodePassword(createUserDto.password),
      },
    });
  }

  async getUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({ where });
    return user;
  }

  async updateUser(updateUserDto: UpdateUserRequest): Promise<User> {
    const data: UpdateUserRequest = updateUserDto.password
      ? updateUserDto
      : {
          ...updateUserDto,
          password: this.encodePassword(updateUserDto.password),
        };

    const user = await this.prisma.user.update({
      where: { id: updateUserDto.id },
      data,
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${updateUserDto.id} not found`);
    }
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }

  async listUsers(where: Prisma.UserWhereInput): Promise<User[]> {
    return this.prisma.user.findMany({ where });
  }

  private encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }
}
