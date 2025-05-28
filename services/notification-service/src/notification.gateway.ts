import {
    WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  
  @WebSocketGateway({ cors: true })
  export class NotificationGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server;
    private logger = new Logger('NotificationGateway');
  
    afterInit() {
      this.logger.log('WebSocket initialized');
    }
  
    handleConnection(client: Socket) {
      const { userId, role } = client.handshake.query;
      if (userId) client.join(`user-${userId}`);
      if (role) client.join(role);
      this.logger.log(`Client connected: ${client.id} [user-${userId}, role: ${role}]`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    sendNotificationToRole(role: string, message: string) {
      this.server.to(role).emit('notification', { message });
    }
  
    sendNotificationToUser(userId: number, message: string) {
      this.server.to(`user-${userId}`).emit('notification', { message });
    }
  }
  