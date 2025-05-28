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
  import { PatientService } from './patient.service';
  import { CreatePatientDto } from '../dto/create-patient.dto';
  import { UpdatePatientDto } from '../dto/update-patient.dto';
  import { RolesGuard } from '../auth/roles.guard';
  import { JwtAuthGuard } from '../auth/jwt-auth.guard';
  import { Roles } from '../auth/roles.decorator';
  import { MessagePattern, Payload } from '@nestjs/microservices';

  
  @Controller('patients')
  @UseGuards(JwtAuthGuard, RolesGuard)
  export class PatientController {
    constructor(private readonly patientService: PatientService) {}
  
    @Get('ping')
    ping() {
    return { status: 'Patient service is alive' };
    }
    
    @Roles('admin', 'doctor')
    @Post()
    create(@Body() dto: CreatePatientDto) {
      return this.patientService.create(dto);
    }
  
    @Roles('admin', 'doctor', 'nurse')
    @Get()
    findAll() {
      return this.patientService.findAll();
    }
  
    @Roles('admin', 'doctor')
    @Get(':id')
    findOne(@Param('id') id: number) {
      return this.patientService.findOne(id);
    }
  
    @Roles('admin', 'doctor')
     @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdatePatientDto) {
        return this.patientService.update(id, dto);
     }
  
    @Roles('admin')
    @Delete(':id')
    remove(@Param('id') id: number) {
      return this.patientService.delete(id);
    }

            @MessagePattern({ cmd: 'patient_create' })
        handleCreate(@Payload() data: CreatePatientDto) {
            return this.patientService.create(data);
        }

        @MessagePattern({ cmd: 'patient_find_all' })
        handleFindAll() {
            return this.patientService.findAll();
        }

        @MessagePattern({ cmd: 'patient_find_one' })
        handleFindOne(@Payload() id: number) {
            return this.patientService.findOne(id);
        }

        @MessagePattern({ cmd: 'patient_update' })
        handleUpdate(@Payload() data: { id: number; body: UpdatePatientDto }) {
            return this.patientService.update(data.id, data.body);
        }

        @MessagePattern({ cmd: 'patient_delete' })
        handleDelete(@Payload() id: number) {
            return this.patientService.delete(id);
        }
  }
  