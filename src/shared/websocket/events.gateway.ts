import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: 'https://telegram-mini-casino.vercel.app' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private readonly logger = new Logger('EventsGateway');
  private connectedUsers: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.logger.log(`User ${userId} connected (${client.id})`);
      this.connectedUsers.set(userId, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.connectedUsers.entries()) {
      if (socketId === client.id) {
        this.logger.log(`User ${userId} disconnected`);
        this.connectedUsers.delete(userId);
        break;
      }
    }
  }

  sendBalanceUpdate(userId: string, newBalance: number): void {
    const socketId = this.connectedUsers.get(userId);
    if (!socketId) {
      this.logger.warn(`No active socket for user ${userId}`);
      return;
    }

    this.server.to(socketId).emit('balanceUpdate', {
      userId,
      newBalance,
    });
    this.logger.log(`Sent balance update to user ${userId}`);
  }
}
