import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import 'reflect-metadata';

async function bootstrap() {
 // const app = await NestFactory.create(AuthModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.TCP,
    options: { 
      host: 'localhost',
       port: 3001 
      },
  });
  
  //app.enableCors({
  //  origin: 'http://localhost:5000',
  //  credentials: true,
  //});

 /* app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  */
  await app.listen();
}
bootstrap();
