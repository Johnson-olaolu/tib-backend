import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @Get('verify-credit-transaction-paystack')
  async verifyCreditTransactionPaystack(@Query('reference') reference: string) {
    return await this.transactionService.verifyCreditTransactionPaystack(
      reference,
    );
  }
}
