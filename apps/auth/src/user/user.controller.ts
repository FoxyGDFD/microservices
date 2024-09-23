import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { UserService } from './user.service';
import {
  DeleteUserRequest,
  GetUserRequest,
  ListUsersRequest,
  ListUsersResponse,
  UpdateUserRequest,
  User,
  UserServiceController,
} from '@app/common';
import { status } from '@grpc/grpc-js';
import { TransformUserInterceptor } from './user-transform.interceptor';

@UseInterceptors(new TransformUserInterceptor())
@Controller()
export class UserController implements UserServiceController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserService', 'GetUser')
  async getUser(data: GetUserRequest): Promise<User> {
    const user = await this.userService.getUser({ id: data.id });
    if (!user) {
      throw new RpcException({
        code: status.NOT_FOUND,
        message: `User with ${JSON.stringify(data)} not found`,
      });
    }
    return user;
  }

  @GrpcMethod('UserService', 'UpdateUser')
  async updateUser(data: UpdateUserRequest): Promise<User> {
    const user = await this.userService.updateUser(data);
    return user;
  }

  @GrpcMethod('UserService', 'DeleteUser')
  async deleteUser(data: DeleteUserRequest): Promise<User> {
    const user = await this.userService.deleteUser(data.id);
    return user;
  }

  @GrpcMethod('UserService', 'ListUsers')
  async listUsers(request: ListUsersRequest): Promise<ListUsersResponse> {
    const users = await this.userService.listUsers(
      {},
      request.limit,
      request.offset,
    );
    return { users };
  }
}
