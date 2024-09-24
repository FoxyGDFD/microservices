import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { protobufPackage, USER_SERVICE_NAME } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MeController } from './me/me.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: protobufPackage,
          protoPath: 'proto/auth.proto',
          url: 'localhost:5000',
        },
      },
    ]),
    AuthModule,
  ],
  controllers: [UsersController, MeController],
  providers: [UsersService],
})
export class UsersModule {}
