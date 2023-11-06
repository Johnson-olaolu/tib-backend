import { NotificationEventTypes } from '@app/shared/utils/constants';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  @IsNotEmpty()
  eventType: NotificationEventTypes;

  @IsString()
  @IsNotEmpty()
  userId: string;

  data: any;
}
