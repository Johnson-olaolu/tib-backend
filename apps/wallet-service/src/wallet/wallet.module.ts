import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { WalletPaymentMethod } from './entities/wallet-payment-method.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Wallet, WalletPaymentMethod]),
    TransactionModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
