import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';
import { ResolveAccountDto } from '@app/shared/dto/wallet/resolve-account.dto';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('verifyCreditTransactionPaystack')
  async verifyCreditTransactionPaystack(@Payload() reference: string) {
    return await this.transactionService.verifyCreditTransactionPaystack(
      reference,
    );
  }

  @MessagePattern('verifyDebitTransactionPaystack')
  async verifyDebitTransactionPaystack(@Payload() reference: string) {
    return await this.transactionService.verifyDebitTransactionPaystack(
      reference,
    );
  }

  @MessagePattern('findOneTransaction')
  findOne(@Payload() id: string) {
    return this.transactionService.findOne(id);
  }

  @MessagePattern('removeTransaction')
  remove(@Payload() id: number) {
    return this.transactionService.remove(id);
  }

  @MessagePattern('getBanks')
  getBanks() {
    return this.transactionService.getBanks();
  }
  @MessagePattern('resolveAccount')
  resolveAccount(@Payload() resolveAccountDto: ResolveAccountDto) {
    return this.transactionService.resolveAccount(resolveAccountDto);
  }
}
