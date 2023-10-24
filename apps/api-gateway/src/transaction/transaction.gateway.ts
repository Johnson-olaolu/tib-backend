import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { TransactionService } from './transaction.service';
import { Server, Socket } from 'socket.io';
import { TransactionModel } from '@app/shared/model/transaction.model';

@WebSocketGateway({ cors: true })
export class TransactionGateway {
  constructor(private readonly transactionService: TransactionService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Handle connection event
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection event
  }

  confirmTransfer(transactionId: string, message: TransactionModel) {
    this.server.emit(transactionId, message);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ) {
    // Handle received message
    this.server.emit('message', data); // Broadcast the message to all connected clients
  }
}
