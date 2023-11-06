import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { CreateNotificationDto } from '@app/shared/dto/notification/create-notification.dto';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @EventPattern('createNotification')
  async create(@Payload() createNotificationDto: CreateNotificationDto) {
    const notification = await this.notificationService.create(
      createNotificationDto,
    );
    this.notificationGateway.updateUserNotifications(notification.userId);
  }

  @MessagePattern('findAllNotification')
  findAll() {
    return this.notificationService.findAll();
  }

  @MessagePattern('findOneNotification')
  findOne(@Payload() id: string) {
    return this.notificationService.findOne(id);
  }

  // @MessagePattern('updateNotification')
  // update(@Payload() updateNotificationDto: UpdateNotificationDto) {
  //   return this.notificationService.update(updateNotificationDto.id, updateNotificationDto);
  // }

  // @MessagePattern('removeNotification')
  // remove(@Payload() id: string) {
  //   return this.notificationService.remove(id);
  // }
}
