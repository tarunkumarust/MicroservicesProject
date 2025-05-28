import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGatewayController } from './auth/auth.controller';
import { PatientGatewayController } from './patients/patients.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001, // auth-service port
        },
       
      },
      {
        name: 'PATIENT_SERVICE',
        transport: Transport.TCP,
        options: { 
          host: 'localhost', 
          port: 3002 }, // same as patient-service
      },
    ]),
  ],
  controllers: [AuthGatewayController, PatientGatewayController],
})
export class AppModule {}
