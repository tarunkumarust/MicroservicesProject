import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly service: NotificationService) {}

  @MessagePattern('notify_appointment')
  async handleAppointment(@Payload() data: any) {
    return this.service.sendAppointmentNotification(data);
  }

  @MessagePattern('notify_result')
  async handleResult(@Payload() data: any) {
    return this.service.sendResultNotification(data);
  }
}
