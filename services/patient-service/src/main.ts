import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { PatientModule } from './patient/patient.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient/patient.entity';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'reflect-metadata';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);  // ✅ create App
    app.enableCors({ origin: 'http://localhost:5000', credentials: true });
    await app.listen(3002);                            // ✅ listen on 3002

    /*const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: 4002, // TCP port for patient-service
      },
    });
    */
  
   // await app.listen();
}  
bootstrap();

/*


async function bootstrap() {
  const app = await NestFactory.create(PatientModule);
  await app.listen(3002);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: 'localhost', port: 4002 },
  });

  await app.startAllMicroservices();
}
import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.TCP,
    options: { 
      host: 'localhost',
       port: 3001 
      },
  });
  await app.listen();
}
bootstrap();

*/