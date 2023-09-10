import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env.validate';
import { RmqModule } from 'libs/rabbitmq/src';

@Module({
  imports: [
    RmqModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
