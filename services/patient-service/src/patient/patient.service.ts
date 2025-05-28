import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
  ) {}

  create(data: Partial<Patient>) {
    const newPatient = this.patientRepo.create(data);
    return this.patientRepo.save(newPatient);
  }

  findAll() {
    return this.patientRepo.find();
  }

  findOne(id: number) {
    return this.patientRepo.findOne({ where: { id } });
  }

  update(id: number, data: Partial<Patient>) {
    return this.patientRepo.update(id, data);
  }

  delete(id: number) {
    return this.patientRepo.delete(id);
  }
}
