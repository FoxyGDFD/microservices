import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE_NAME, protobufPackage } from '@app/common';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: protobufPackage,
          protoPath: 'proto/auth.proto',
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
