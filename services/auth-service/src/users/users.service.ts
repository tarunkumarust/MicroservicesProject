import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
     private readonly userRepo: Repository<User>,
    ) {}

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  create(user: Partial<User>) {
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }

  findAll() {
    return this.userRepo.find();
  }
  
  async findById(id: number): Promise<User> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new Error('User not found');
    return user;
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new Error('User not found');

    Object.assign(user, data);
    if (data.password) {
      user.password = await bcrypt.hash(data.password, 10);
    }

    return this.userRepo.save(user);
  }

  async remove(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
