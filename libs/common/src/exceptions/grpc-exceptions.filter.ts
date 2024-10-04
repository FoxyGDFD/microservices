import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  RpcExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { status } from '@grpc/grpc-js';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

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
export class GrpcExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost) {
    const error = exception.getError() as { code: number; message: string };
    let message: string;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const code = HTTP_CODE_FROM_gRPC[error.code];

    return throwError(() =>
      response.status(code).json({
        statusCode: code,
        message: message,
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
