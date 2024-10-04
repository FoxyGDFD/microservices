import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ApiGatewayModule } from './api-gateway.module';
import { GrpcExceptionFilter } from '@app/common';
import { ConfigService } from '@nestjs/config';

export const logger = new Logger('Api Gateway');

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new GrpcExceptionFilter());

  app.setGlobalPrefix('/api');

  const configService = app.get(ConfigService);
  const port = configService.get<string>('API_GATEWAY_SERVICE_PORT');

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

  app.listen(port).then(() => logger.log(`Microservice is listening ${port}`));
}
bootstrap();
