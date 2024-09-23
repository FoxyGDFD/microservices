import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';

export const HTTP_CODE_FROM_gRPC: Record<number, number> = {
  [status.OK]: HttpStatus.OK,
  [status.CANCELLED]: HttpStatus.METHOD_NOT_ALLOWED,
  [status.UNKNOWN]: HttpStatus.BAD_GATEWAY,
  [status.INVALID_ARGUMENT]: HttpStatus.UNPROCESSABLE_ENTITY,
  [status.DEADLINE_EXCEEDED]: HttpStatus.REQUEST_TIMEOUT,
  [status.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [status.ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [status.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [status.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
  [status.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_REQUIRED,
  [status.ABORTED]: HttpStatus.METHOD_NOT_ALLOWED,
  [status.OUT_OF_RANGE]: HttpStatus.PAYLOAD_TOO_LARGE,
  [status.UNIMPLEMENTED]: HttpStatus.NOT_FOUND,
  [status.INTERNAL]: HttpStatus.BAD_REQUEST,
  [status.UNAVAILABLE]: HttpStatus.BAD_GATEWAY,
  [status.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  [status.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
};

@Catch(RpcException)
export class GrpcExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const error = exception.message;
    const statusCode =
      HTTP_CODE_FROM_gRPC[error.split(': ').shift().split(' ').shift()] ??
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(statusCode).json({
      message: error.split(': ').pop(),
    });
  }
}
