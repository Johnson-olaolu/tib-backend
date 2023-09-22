import { notificationTypes } from '@app/shared/utils/constants';

export interface INotification<T> {
  type: notificationTypes[];
  recipient: {
    mail: string;
    name: string;
  };
  data: T;
}

export interface RegistrationNotificationData {
  name: string;
  token: string;
  date: string;
}

export interface PasswordResetNotificationData {
  url: string;
}
export interface TransferCreditNotificationData {
  amount: number;
}
