
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';
import { NotificationGateway } from './notification.gateway';

@Injectable() 
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
    private readonly gateway: NotificationGateway,
  ) {}

  async notifyUser(userId: number, message: string, type: string = 'info') {
    const notification = this.notificationRepo.create({ userId, message, type });
    await this.notificationRepo.save(notification);
    this.gateway.sendNotificationToUser(userId, message);
    return notification;
  }

  findUserNotifications(userId: number) {
    return this.notificationRepo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  markAsRead(id: number) {
    return this.notificationRepo.update(id, { read: true });
  }

  findAll() {
    return this.notificationRepo.find();
  }
}
