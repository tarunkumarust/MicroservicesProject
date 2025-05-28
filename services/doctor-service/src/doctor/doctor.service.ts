import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './doctor.entity';

@Injectable()
export class DoctorService {
  constructor(@InjectRepository(Doctor) private doctorRepo: Repository<Doctor>) {}

  create(data: Partial<Doctor>) {
    return this.doctorRepo.save(this.doctorRepo.create(data));
  }

  findAll() {
    return this.doctorRepo.find();
  }

  findOne(id: number) {
    return this.doctorRepo.findOne({ where: { id } });
  }

  update(id: number, data: Partial<Doctor>) {
    return this.doctorRepo.update(id, data);
  }

  delete(id: number) {
    return this.doctorRepo.delete(id);
  }
}
