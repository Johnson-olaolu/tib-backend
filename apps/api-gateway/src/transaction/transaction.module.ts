import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionGateway } from './transaction.gateway';
import { TransactionController } from './transaction.controller';

@Module({
  providers: [TransactionGateway, TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}
