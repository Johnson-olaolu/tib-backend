import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { EmailNotificationModule } from './email-notification/email-notification.module';

@Module({
  imports: [PushNotificationModule, EmailNotificationModule],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
