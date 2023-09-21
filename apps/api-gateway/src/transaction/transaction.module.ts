import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionGateway } from './transaction.gateway';

@Module({
  providers: [TransactionGateway, TransactionService]
})
export class TransactionModule {}
