import { Controller, NotFoundException, UseGuards } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  DeleteUserRequest,
  DeleteUserResponse,
  GetUserRequest,
  ListUsersRequest,
  ListUsersResponse,
  UpdateUserRequest,
  User,
  UserServiceController,
} from '@app/common/types';

@Controller()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: GetUserRequest): Promise<User> {
    const user = await this.userService.getUser({ id: data.id });
    if (!user) {
      throw new NotFoundException(
        `User with ${JSON.stringify(data)} not found`,
      );
    }
    return user;
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: UpdateUserRequest): Promise<User> {
    const user = await this.userService.updateUser(data);
    return user;
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(data: DeleteUserRequest): Promise<DeleteUserResponse> {
    const success = await this.userService.deleteUser(data.id);
    return { success };
  }

  @GrpcMethod('UserService', 'ListUsers')
  async listUsers(request: ListUsersRequest): Promise<ListUsersResponse> {
    const users = await this.userService.listUsers({});
    return { users };
  }
}
