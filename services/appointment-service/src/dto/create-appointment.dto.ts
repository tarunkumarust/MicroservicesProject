export class CreateAppointmentDto {
  patientId: number;
  doctorId: number;
  date: string;
  time: string;
  reason?: string;
}
