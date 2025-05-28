import { DataSource } from 'typeorm';
import { Doctor } from '../doctor/doctor.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'hospital',
  schema: 'doctor',
  entities: [Doctor],
  synchronize: true,
});
