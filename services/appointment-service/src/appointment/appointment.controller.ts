import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateAppointmentDto } from '../dto/update-appointment.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
  constructor(private readonly service: AppointmentService) {}

  // REST APIs
  @Roles('admin', 'doctor')
  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    return this.service.create(dto);
  }

  @Roles('admin', 'doctor', 'nurse')
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Roles('admin', 'doctor')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Roles('admin', 'doctor')
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateAppointmentDto) {
    return this.service.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.delete(id);
  }

  // TCP Microservice handlers
  @MessagePattern({ cmd: 'appointment_create' })
  handleCreate(@Payload() data: CreateAppointmentDto) {
    return this.service.create(data);
  }

  @MessagePattern({ cmd: 'appointment_find_all' })
  handleFindAll() {
    return this.service.findAll();
  }

  @MessagePattern({ cmd: 'appointment_find_one' })
  handleFindOne(@Payload() id: number) {
    return this.service.findOne(id);
  }

  @MessagePattern({ cmd: 'appointment_update' })
  handleUpdate(@Payload() data: { id: number; body: UpdateAppointmentDto }) {
    return this.service.update(data.id, data.body);
  }

  @MessagePattern({ cmd: 'appointment_delete' })
  handleDelete(@Payload() id: number) {
    return this.service.delete(id);
  }
}
