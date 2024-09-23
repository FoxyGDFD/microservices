import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { GrpcExceptionFilter } from '@app/common';
import { GrpcExceptionsInterceptor } from '@app/common/exceptions/grpc-exceptions.interceptor';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalInterceptors(new GrpcExceptionsInterceptor());
  app.useGlobalFilters(new GrpcExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Microservices API Gateway')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Default JWT Authorization',
        type: 'http',
        in: 'header',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.listen(8000).then(() => logger.log('Microservice is listening 8000'));
}
bootstrap();
