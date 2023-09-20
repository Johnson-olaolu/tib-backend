import { Module } from '@nestjs/common';
import { WalletServiceController } from './wallet-service.controller';
import { WalletServiceService } from './wallet-service.service';
import { WalletModule } from './wallet/wallet.module';
import { PaymentMethodModule } from './payment-method/payment-method.module';
import { TransactionModule } from './transaction/transaction.module';
import { RmqModule } from '@app/rmq';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { DatabaseModule } from '@app/database';
import { SeedService } from './seed/seed.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validateEnv } from './utils/env.validate';
import { HttpModule } from '@nestjs/axios';
import { PaystackModule } from './paystack/paystack.module';

@Module({
  imports: [
    RmqModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    WalletModule,
    TransactionModule,
    PaymentMethodModule,
    RmqModule.register({ name: RABBITMQ_QUEUES.FILE_SERVICE }),
    DatabaseModule,
    PaystackModule,
  ],
  controllers: [WalletServiceController],
  providers: [WalletServiceService, SeedService],
})
export class WalletServiceModule {}
