import {   Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthGatewayController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  @Post('login')
  login(@Body() body: any): Observable<any> {
    return this.client.send({ cmd: 'auth_login' }, body);
  }

  @Post('register')
  register(@Body() body: any): Observable<any> {
    return this.client.send({ cmd: 'auth_register' }, body);
  }

  @Get('users')
  getUsers(): Observable<any> {
    return this.client.send({ cmd: 'auth_get_users' }, {});
  }
  
  @Put('users/:id')
    updateUser(@Param('id') id: number, @Body() body: any): Observable<any> {
      return this.client.send({ cmd: 'auth_update_user' }, { id: +id, body });
    }

  @Delete('users/:id')
    deleteUser(@Param('id') id: number): Observable<any> {
      return this.client.send({ cmd: 'auth_delete_user' }, +id);
    }
  
}





/*import { Controller, Post, Body, Inject, Get } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('auth')
export class AuthGatewayController {
  constructor(@Inject('AUTH_SERVICE') private readonly client: ClientProxy) {}

  @Post('login')
  async login(@Body() body: any) {
    return this.client.send('auth_login', body);
  }

  @Post('register')
  async register(@Body() body: any) {
    return this.client.send('auth_register', body);
  }

  @Get('users')
  async getUsers() {
    return this.client.send('auth_get_users', {});
  }
}
*/