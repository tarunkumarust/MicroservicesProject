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
import { DoctorService } from './doctor.service';
import { CreateDoctorDto } from '../dto/create-doctor.dto';
import { UpdateDoctorDto  } from '../dto/update-doctor.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // REST endpoints
  @Roles('admin')
  @Post()
  create(@Body() dto: CreateDoctorDto) {
    return this.doctorService.create(dto);
  }

  @Roles('admin', 'doctor', 'nurse')
  @Get()
  findAll() {
    return this.doctorService.findAll();
  }

  @Roles('admin', 'doctor')
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.doctorService.findOne(id);
  }

  @Roles('admin')
  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateDoctorDto) {
    return this.doctorService.update(id, dto);
  }

  @Roles('admin')
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.doctorService.delete(id);
  }

  // TCP microservice handlers
  @MessagePattern({ cmd: 'doctor_create' })
  handleCreate(@Payload() data: CreateDoctorDto) {
    return this.doctorService.create(data);
  }

  @MessagePattern({ cmd: 'doctor_find_all' })
  handleFindAll() {
    return this.doctorService.findAll();
  }

  @MessagePattern({ cmd: 'doctor_find_one' })
  handleFindOne(@Payload() id: number) {
    return this.doctorService.findOne(id);
  }

  @MessagePattern({ cmd: 'doctor_update' })
  handleUpdate(@Payload() data: { id: number; body: UpdateDoctorDto }) {
    return this.doctorService.update(data.id, data.body);
  }

  @MessagePattern({ cmd: 'doctor_delete' })
  handleDelete(@Payload() id: number) {
    return this.doctorService.delete(id);
  }
}
