import { Injectable } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationService } from './notification.service';

@WebSocketGateway({
  cors: true,
  namespace: 'notification',
  transports: ['websocket', 'polling'],
})
export class NotificationGateway {
  constructor(private readonly notificationService: NotificationService) {}
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Handle connection event
    const userId = (client.handshake.query?.userId as string) || '';
    console.log({ userId });
    this.updateUserNotifications(userId);
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection event
  }

  async updateUserNotifications(userId: string) {
    const notifications = await this.notificationService.findUserNotifications(
      userId,
    );
    console.log(notifications);
    this.server.emit(userId, notifications);
  }

  // @SubscribeMessage('message')
  // handleMessage(client: any, payload: any): string {
  //   return 'Hello world!';
  // }

  @SubscribeMessage('notificationSeen')
  async handleNotificationSeen(client: any, payload: string) {
    const notification = await this.notificationService.updateNotificationSeen(
      payload,
    );

    this.updateUserNotifications(notification.userId);
  }

  @SubscribeMessage('notificationDelete')
  async handleNotificationDelete(client: any, payload: string) {
    const notification = await this.notificationService.remove(payload);
    console.log(notification);
    this.updateUserNotifications(notification.userId);
  }
}
