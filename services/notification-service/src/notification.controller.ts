
import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @Post()
  async send(@Body() body: { userId: number; message: string; type?: string }) {
    return this.service.notifyUser(body.userId, body.message, body.type);
  }

  @Get(':userId')
  getUserNotifications(@Param('userId') userId: number) {
    return this.service.findUserNotifications(+userId);
  }

  @Patch(':id/read')
  markRead(@Param('id') id: number) {
    return this.service.markAsRead(+id);
  }

  @Get()
  getAll() {
    return this.service.findAll();
  }
}

