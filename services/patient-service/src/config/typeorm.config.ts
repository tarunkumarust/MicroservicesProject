import { DataSource } from 'typeorm';
import { Patient } from '../patient/patient.entity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'hospital',
  schema: 'patient',
  entities: [Patient],
  synchronize: true,
});
