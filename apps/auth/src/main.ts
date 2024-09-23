import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { protobufPackage } from '@app/common';
import { ValidationError, ValidationPipe } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { error } from 'console';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: 'proto/auth.proto',
        package: protobufPackage,
        url: 'localhost:5000',
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new RpcException({
          code: status.INVALID_ARGUMENT,
          message: validationErrors
            .map((error) => Object.values(error.constraints))
            .join(', '),
        });
      },
    }),
  );

  await app.listen();
}

bootstrap();
