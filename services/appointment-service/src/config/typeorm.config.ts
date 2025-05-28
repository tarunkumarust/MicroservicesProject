import { DataSource } from 'typeorm';
import { Appointment } from '../appointment/appointment.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'hospital',
  schema: 'appointment',
  entities: [Appointment],
  synchronize: true,
});
