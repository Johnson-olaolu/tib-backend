import { notificationTypes } from '@app/shared/utils/constants';

export interface INotification<T> {
  type: notificationTypes[];
  data: T;
}

export interface RegistrationNotificationData {
  recipientMail: string;
  name: string;
  token: string;
  date: string;
}

export interface PasswordResetNotificationData {
  recipientMail: string;
  url: string;
}
