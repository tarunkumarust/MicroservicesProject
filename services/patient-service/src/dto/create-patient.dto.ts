export class CreatePatientDto {
    name: string;
    gender: string;
    age: number;
    doctorId: number;
    department: string;
    medicalHistory?: string;
  }