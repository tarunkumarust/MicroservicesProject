import { Controller, Get, Post, Put, Delete, Param, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('patients')
export class PatientGatewayController {
  constructor(@Inject('PATIENT_SERVICE') private readonly client: ClientProxy) {}

  @Post()
  create(@Body() body: any): Observable<any> {
    return this.client.send({ cmd: 'patient_create' }, body);
  }

  @Get()
  findAll(): Observable<any> {
    return this.client.send({ cmd: 'patient_find_all' }, {});
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<any> {
    return this.client.send({ cmd: 'patient_find_one' }, +id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any): Observable<any> {
    return this.client.send({ cmd: 'patient_update' }, { id: +id, body });
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<any> {
    return this.client.send({ cmd: 'patient_delete' }, +id);
  }
}
