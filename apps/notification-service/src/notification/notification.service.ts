import { Controller, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { CreateNotificationDto } from '@app/shared/dto/notification/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}
  async create(createNotificationDto: CreateNotificationDto) {
    const newNotification = await this.notificationRepository.save(
      createNotificationDto,
    );
    return newNotification;
  }

  findAll() {
    return `This action returns all notification`;
  }

  async findUserNotifications(userId: string) {
    const notifications = await this.notificationRepository.find({
      where: {
        userId,
      },
      order: {
        createdAt: 'DESC',
      },
    });
    return notifications;
  }

  async findOne(id: string) {
    const notification = await this.notificationRepository.findOneBy({ id });
    if (!notification) {
      throw new RpcException(
        new NotFoundException('User not found for this ID'),
      );
    }
    return notification;
  }

  async updateNotificationSeen(id: string) {
    const notification = await this.findOne(id);
    notification.seen = true;
    await notification.save();
    return notification;
  }

  async remove(id: string) {
    const notification = await this.findOne(id);
    await notification.remove();
    return notification;
  }
}
