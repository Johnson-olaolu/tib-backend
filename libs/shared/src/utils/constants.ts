export const POSTGRES_ERROR_CODES = {
  unique_violation: 23505,
};

export const RABBITMQ_QUEUES = {
  USER_SERVICE: 'USER',
  FILE_SERVICE: 'FILE',
  NOTIFICATION_SERVICE: 'NOTIFICATION',
  WALLET_SERVICE: 'WALLET',
};

export enum FileTypeEnum {
  APP = 'APP',
  PROFILE = 'PROFILE',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
}

export type notificationTypes = 'email' | 'push';
