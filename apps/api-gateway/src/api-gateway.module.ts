import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env.validation';
import { RmqModule } from 'libs/rabbitmq/src';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { InterestModule } from './interest/interest.module';
import { PlanModule } from './plan/plan.module';
import { PlanPermissionModule } from './plan-permission/plan-permission.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { RABBITMQ_QUEUES } from './utils/constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    NestjsFormDataModule.config({ storage: MemoryStoredFile, isGlobal: true }),
    RmqModule.register({ name: RABBITMQ_QUEUES.USER_SERVICE }),
    AuthModule,
    UserModule,
    InterestModule,
    PlanModule,
    PlanPermissionModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
