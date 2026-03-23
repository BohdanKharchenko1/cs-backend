import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UnauthorizedException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { GameState } from '../../game/state/game-state.model';
import { GameService } from '../../game/game.service';
import { AuthService } from '../../auth/auth.service';
import * as socketTypes from './socket.types';

@WebSocketGateway({
  cors: { origin: 'https://telegram-mini-casino.vercel.app' },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  private connectedUsers: Map<string, Set<string>> = new Map();

  constructor(
    private gameService: GameService,
    private authService: AuthService,
  ) {}

  /*
  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.logger.log(`User ${userId} connected (${client.id})`);
      this.connectedUsers.set(userId, client.id);
      this.server
        .to(client.id)
        .emit('state_snapshot', this.gameService.getStateSnapshot());
    }
  }
*/
  async handleConnection(client: socketTypes.AppSocket) {
    //treat auth.initData as unknown and then narrow the type to string to proceed with auth
    const handshakeAuth = client.handshake.auth as Record<string, unknown>;
    const initData = handshakeAuth.initData;

    //narrowing to safely treat as string
    if (typeof initData !== 'string' || initData.length === 0) {
      throw new UnauthorizedException('Invalid initData');
    }
    const checkedUser = await this.authService.authInit(initData);

    client.data.userId = checkedUser.id;
    //finding if user has a set with connected sockets, if not we create a new set with socket id
    let connectedSockets = this.connectedUsers.get(checkedUser.id);

    if (!connectedSockets) {
      connectedSockets = new Set([client.id]);
    } else {
      connectedSockets.add(client.id);
    }

    //updating our map; track all active websockets for a user
    this.connectedUsers.set(checkedUser.id, connectedSockets);

    //send current state_snapshot to the newly connected session
    this.server
      .to(client.id)
      .emit('state_snapshot', this.gameService.getStateSnapshot());
  }

  handleDisconnect(client: socketTypes.AppSocket) {
    const userId = client.data.userId;

    const connectedSockets = this.connectedUsers.get(userId);

    if (!connectedSockets) {
      return;
    }
    connectedSockets.delete(client.id);

    if (connectedSockets.size === 0) {
      this.connectedUsers.delete(userId);
    }
  }

  @SubscribeMessage('place_bet')
  async handleBet(
    @MessageBody('bet_amount') betAmount: string,
    @ConnectedSocket() client: socketTypes.AppSocket,
  ) {
    const userId = client.data.userId;

    if (!userId) {
      throw new UnauthorizedException('Missing auth context');
    }

    const placeBetInput = {
      userId,
      betAmount,
    };

    await this.gameService.placeBet(placeBetInput);
  }

  /*
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
  */

  //send snapshot of the current game state to all connected users( happens when someone make a bet, cashout etc...) temporary solution i might change it later
  //needs to be removed to fulfil my design model - dont want circular dependency
  @OnEvent('state_sync')
  sendSnapshot(gameState: GameState) {
    this.server.emit('state_sync', gameState);
  }
}
