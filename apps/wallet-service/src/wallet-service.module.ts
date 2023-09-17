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
import { PaystackService } from './paystack/paystack.service';

@Module({
  imports: [
    WalletModule,
    TransactionModule,
    PaymentMethodModule,
    RmqModule.register({ name: RABBITMQ_QUEUES.FILE_SERVICE }),
    DatabaseModule,
  ],
  controllers: [WalletServiceController],
  providers: [WalletServiceService, SeedService, PaystackService],
})
export class WalletServiceModule {}
