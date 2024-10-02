import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  UserServiceClient,
  DeleteUserRequest,
  GetUserRequest,
  ListUsersRequest,
  ListUsersResponse,
  UpdateUserRequest,
  User,
  USER_SERVICE_NAME,
  CreateUserRequest,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService implements OnModuleInit, UserServiceClient {
  constructor(@Inject(USER_SERVICE_NAME) private client: ClientGrpc) {}
  private grpcUserService: UserServiceClient;

  onModuleInit() {
    this.grpcUserService =
      this.client.getService<UserServiceClient>(USER_SERVICE_NAME);
  }

  createUser(request: CreateUserRequest): Observable<User> {
    return this.grpcUserService.createUser(request);
  }

  getUser(request: GetUserRequest): Observable<User> {
    return this.grpcUserService.getUser(request);
  }
  updateUser(request: UpdateUserRequest): Observable<User> {
    return this.grpcUserService.updateUser(request);
  }
  deleteUser(request: DeleteUserRequest): Observable<User> {
    return this.grpcUserService.deleteUser(request);
  }

  listUsers(request: ListUsersRequest): Observable<ListUsersResponse> {
    return this.grpcUserService.listUsers(request);
  }
}
