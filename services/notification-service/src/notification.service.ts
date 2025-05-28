import { Injectable } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
  constructor(private gateway: NotificationGateway) {}

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  async sendAppointmentNotification(data: any) {
    const { patientEmail, doctorEmail, appointmentTime, patientId, doctorId } = data;
    const msg = `Appointment confirmed at ${appointmentTime}`;
    await this.transporter.sendMail({ from: process.env.EMAIL_USER, to: patientEmail, subject: 'Appointment', text: msg });
    await this.transporter.sendMail({ from: process.env.EMAIL_USER, to: doctorEmail, subject: 'New Appointment', text: msg });
    this.gateway.sendNotificationToUser(patientId, msg);
    this.gateway.sendNotificationToUser(doctorId, msg);
    return { status: 'sent' };
  }

  async sendResultNotification(data: any) {
    const { patientEmail, resultDetails, patientId } = data;
    await this.transporter.sendMail({ from: process.env.EMAIL_USER, to: patientEmail, subject: 'Test Result', text: resultDetails });
    this.gateway.sendNotificationToUser(patientId, 'Your test result is ready.');
    return { status: 'result sent' };
  }
}
