
import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendNotificationToUser(userId: number, message: string) {
    this.server.to(`user_${userId}`).emit('notification', { message });
  }

  handleConnection(client: any) {
    const userId = client.handshake.query.userId;
    if (userId) client.join(`user_${userId}`);
  }
}
