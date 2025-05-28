import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('doctors', { schema: 'doctor' })
export class Doctor {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  specialization!: string;

  @Column()
  availability!: string;
}
