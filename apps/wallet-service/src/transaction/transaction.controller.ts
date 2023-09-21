import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TransactionService } from './transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @MessagePattern('findAllTransaction')
  findAll() {
    return this.transactionService.findAll();
  }

  @MessagePattern('findOneTransaction')
  findOne(@Payload() id: number) {
    return this.transactionService.findOne(id);
  }

  @MessagePattern('removeTransaction')
  remove(@Payload() id: number) {
    return this.transactionService.remove(id);
  }
}
