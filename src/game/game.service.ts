import { Injectable } from '@nestjs/common';
import { createInitialGameState } from './state/game-state.factory';
import { GameState } from './state/game-state.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlaceBetInput } from './dto/in/place-bet';
import { UserService } from '../user/user.service';
import { GameStatus } from './enums/game-status.enums';

@Injectable()
export class GameService {
  gameState: GameState = createInitialGameState();

  constructor(
    private eventEmitter: EventEmitter2,
    private userService: UserService,
  ) {}

  broadcastStateSync() {
    this.eventEmitter.emit('state_sync', this.gameState);
  }

  getStateSnapshot() {
    return this.gameState;
  }

  async placeBet(bet: PlaceBetInput) {
    if (this.gameState.status !== GameStatus.STARTED) {
      return new Error('Cannot place a bet if the game has already started');
    }
    const user = await this.userService.findUserById(bet.user.id);
    if (!user) {
      return new Error('User not found');
    }
  }
}
