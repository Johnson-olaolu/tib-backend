import { Controller, Get } from '@nestjs/common';
import { NotificationServiceService } from './notification-service.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import {
  INotification,
  PasswordResetNotificationData,
  RegistrationNotificationData,
  TransferCreditNotificationData,
} from '@app/shared/dto/notification/notificationTypes';
import { EmailNotificationService } from './email-notification/email-notification.service';

@Controller()
export class NotificationServiceController {
  constructor(
    private readonly notificationServiceService: NotificationServiceService,
    private emailNotificationService: EmailNotificationService,
  ) {}

  @EventPattern('userRegistered')
  async sendUserConfirmationNotification(
    @Payload() notificationData: INotification<RegistrationNotificationData>,
  ) {
    await this.emailNotificationService.sendUserConfirmationMail(
      notificationData.recipient,
      notificationData.data,
    );
  }

  @EventPattern('passwordReset')
  async sendPasswordResetNotification(
    @Payload() notificationData: INotification<PasswordResetNotificationData>,
  ) {
    await this.emailNotificationService.sendPasswordResetMail(
      notificationData.recipient,
      notificationData.data,
    );
  }

  @EventPattern('creditWallet')
  async sendCreditWalletNotification(
    @Payload() notificationData: INotification<TransferCreditNotificationData>,
  ) {
    await this.emailNotificationService.sendCreditWalletMail(
      notificationData.recipient,
      notificationData.data,
    );
  }
}
