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
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { IdeaConstantsModule } from './idea-constants/idea-constants.module';
import { IdeaModule } from './idea/idea.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // validate: validateEnv,
    }),
    NestjsFormDataModule.config({ storage: MemoryStoredFile, isGlobal: true }),
    RmqModule.register({ name: RABBITMQ_QUEUES.USER_SERVICE }),
    RmqModule.register({ name: RABBITMQ_QUEUES.WALLET_SERVICE }),
    RmqModule.register({ name: RABBITMQ_QUEUES.IDEA_SERVICE }),
    AuthModule,
    UserModule,
    InterestModule,
    PlanModule,
    PlanPermissionModule,
    WalletModule,
    TransactionModule,
    PaymentMethodModule,
    IdeaConstantsModule,
    IdeaModule,
    CategoryModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
