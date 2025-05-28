import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('appointments', { schema: 'appointment' })
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  patientId!: number;

  @Column()
  doctorId!: number;

  @Column()
  date!: string;

  @Column()
  time!: string;

  @Column({ nullable: true })
  reason?: string;

  @Column({ default: 'scheduled' })
  status!: 'scheduled' | 'completed' | 'cancelled';
}
