export const POSTGRES_ERROR_CODES = {
  unique_violation: 23505,
};

export const RABBITMQ_QUEUES = {
  USER_SERVICE: 'USER',
  FILE_SERVICE: 'FILE',
  NOTIFICATION_SERVICE: 'NOTIFICATION',
  WALLET_SERVICE: 'WALLET',
  IDEA_SERVICE: 'IDEA',
};

export enum FileTypeEnum {
  APP = 'APP',
  PROFILE = 'PROFILE',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
}

export type notificationTypes = 'email' | 'push';

export enum TransferTypesEnum {
  BASIC = 'BASIC',
  IDEA_FUNDING = 'IDEA_FUNDING',
  IDEA_BUYING = 'IDEA_BUYING',
  PLAN_SUBSCRIPTION = 'PLAN_SUBSCRIPTION',
}

export const currencies = ['NGN', 'USD'] as const;

export type NotificationEventTypes = 'follow-request';
