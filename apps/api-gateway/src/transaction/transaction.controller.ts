import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ResolveAccountDto } from '@app/shared/dto/wallet/resolve-account.dto';
import { ApiTags } from '@nestjs/swagger';
import { TransactionGateway } from './transaction.gateway';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private transactionGateway: TransactionGateway,
  ) {}
  @Get('verify-credit-transaction-paystack')
  async verifyCreditTransactionPaystack(@Query('reference') reference: string) {
    const data = await this.transactionService.verifyCreditTransactionPaystack(
      reference,
    );
    this.transactionGateway.confirmTransfer(data.id, data);
    return 'transaction handled';
  }

  @Post('paystack-notification')
  async handlePaystackNotification(@Body() payload) {
    if (payload.event === 'transfer.success') {
      return await this.transactionService.verifyDebitTransactionPaystack(
        payload?.data?.reference,
      );
    }
    return;
  }

  @Get('getBanks')
  async getBanks() {
    return this.transactionService.getBanks();
  }

  @Post('resolve-account')
  async resolveAccount(@Body() resolveAccountDto: ResolveAccountDto) {
    return this.transactionService.resolveAccount(resolveAccountDto);
  }
}
