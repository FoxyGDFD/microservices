import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { protobufPackage } from '@app/common';
import { Logger, ValidationError, ValidationPipe } from '@nestjs/common';
import { status } from '@grpc/grpc-js';
import { ConfigService } from '@nestjs/config';

export const logger = new Logger('Auth Microservice');

async function bootstrap() {
  const appContext = await NestFactory.create(AuthModule);
  const configService = appContext.get(ConfigService);
  const port = configService.get<string>('AUTH_SERVICE_PORT');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthModule,
    {
      transport: Transport.GRPC,
      options: {
        protoPath: 'proto/auth.proto',
        package: protobufPackage,
        url: `auth:${port}`,
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

  await app
    .listen()
    .then(() => logger.log(`Auth microservice listening on port ${port}`));
}

bootstrap();
