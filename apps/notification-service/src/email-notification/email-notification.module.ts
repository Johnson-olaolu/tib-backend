import { Module } from '@nestjs/common';
import { EmailNotificationService } from './email-notification.service';
import { EmailNotificationController } from './email-notification.controller';

@Module({
  controllers: [EmailNotificationController],
  providers: [EmailNotificationService]
})
export class EmailNotificationModule {}
