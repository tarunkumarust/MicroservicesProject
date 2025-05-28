import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('patients', { schema: 'patient' })
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  gender!: string;

  @Column()
  age!: number;

  @Column()
  doctorId!: number;

  @Column()
  department!: string;

  @Column({ nullable: true })
  medicalHistory?: string;
}
