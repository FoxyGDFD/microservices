import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { MeController } from './me/me.controller';
import { protobufPackage, USER_SERVICE_NAME } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    AuthModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: USER_SERVICE_NAME,
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: protobufPackage,
            protoPath: 'proto/auth.proto',
            url: configService.get<string>('AUTH_SERVICE_HOST'),
          },
        }),
      },
    ]),
  ],
  controllers: [UsersController, MeController],
  providers: [UsersService],
})
export class UsersModule {}
