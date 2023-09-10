import { Module } from '@nestjs/common';
import { UserServiceController } from './user-service.controller';
import { UserServiceService } from './user-service.service';
import { DatabaseModule } from '@app/database';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env.validate';
import { RmqModule } from 'libs/rabbitmq/src';
import { UserModule } from './user/user.module';
import { PlanModule } from './plan/plan.module';
import { InterestModule } from './interest/interest.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    RmqModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    UserModule,
    PlanModule,
    InterestModule,
    AuthModule,
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
