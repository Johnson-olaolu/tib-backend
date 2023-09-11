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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    RmqModule.register({ name: 'USER' }),
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
