import { Controller,Inject, Post, Body, UseGuards, Get, Request } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.strategy';
import { UsersService } from '../users/users.service';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';


@Controller()
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @MessagePattern({ cmd: 'auth_login' })
  async loginHandler(@Payload() body: any) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new RpcException({ status: 401, message: 'Invalid credentials' });
    }
    return this.authService.login(user);
  }

  @MessagePattern({ cmd: 'auth_register' })
  async registerHandler(@Payload() body: any) {
    return this.usersService.create(body);
  }

  @MessagePattern({ cmd: 'auth_get_users' })
  async getAllUsers() {
    return this.usersService.findAll();
  }
  @MessagePattern({ cmd: 'auth_update_user' })
    async updateUser(@Payload() data: { id: number; body: any }) {
      return this.usersService.update(data.id, data.body);
    }

  @MessagePattern({ cmd: 'auth_delete_user' })
    async deleteUser(@Payload() id: number) {
      return this.usersService.remove(id);
    }

}
/*
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Post('login')
  async login(@Body() body) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) throw new Error('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('register')
  register(@Body() body) {
    return this.usersService.create(body);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('users')
  getAllUsers(@Request() req) {
    return this.usersService.findAll();
  }
}
*/