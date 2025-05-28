import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users', { schema: 'auth' })
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: ['admin', 'doctor', 'nurse', 'patient'], default: 'patient' })
  role!: 'admin' | 'doctor' | 'nurse' | 'patient';
}
