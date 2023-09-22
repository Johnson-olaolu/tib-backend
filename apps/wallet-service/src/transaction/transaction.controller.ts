import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('verifyCreditTransactionPaystack')
  async verifyCreditTransactionPaystack(@Payload() reference: string) {
    return await this.transactionService.verifyCreditTransactionPaystack(
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
}
