import { Module } from '@nestjs/common';
import { NotificationServiceController } from './notification-service.controller';
import { NotificationServiceService } from './notification-service.service';
import { PushNotificationModule } from './push-notification/push-notification.module';
import { EmailNotificationModule } from './email-notification/email-notification.module';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env.validation';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { RmqModule } from '@app/rmq';

@Module({
  imports: [
    PushNotificationModule,
    EmailNotificationModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    RmqModule.register({ name: RABBITMQ_QUEUES.FILE_SERVICE }),
  ],
  controllers: [NotificationServiceController],
  providers: [NotificationServiceService],
})
export class NotificationServiceModule {}
