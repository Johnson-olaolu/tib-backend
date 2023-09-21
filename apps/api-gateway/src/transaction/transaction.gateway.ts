import { WebSocketGateway } from '@nestjs/websockets';
import { TransactionService } from './transaction.service';

@WebSocketGateway()
export class TransactionGateway {
  constructor(private readonly transactionService: TransactionService) {}
}
