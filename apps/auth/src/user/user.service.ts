import { CreateUserRequest, UpdateUserRequest } from '@app/common';
import { PrismaService } from '@app/common/prisma/prisma.service';
import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
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
    const user = await this.prisma.user.findUnique({
      where,
    });
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
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `User with ID ${updateUserDto.id} not found`,
      });
    }
    return user;
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async listUsers(
    where: Prisma.UserWhereInput,
    offset?: number,
    limit?: number,
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      where,

      skip: offset,
      take: limit,
    });
  }

  private encodePassword(password: string): string {
    const salt: string = bcrypt.genSaltSync(10);

    return bcrypt.hashSync(password, salt);
  }
}
