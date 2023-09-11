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
import { RoleModule } from './role/role.module';
import { SeedService } from './seed/seed.service';
import { PlanPermissionModule } from './plan-permission/plan-permission.module';

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
    RoleModule,
    PlanPermissionModule,
  ],
  controllers: [UserServiceController],
  providers: [UserServiceService, SeedService],
})
export class UserServiceModule {}
