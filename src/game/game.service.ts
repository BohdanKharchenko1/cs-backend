import { Injectable } from '@nestjs/common';
import { createInitialGameState } from './state/game-state.factory';
import { Bet, GameState } from './state/game-state.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PlaceBetInput } from './dto/in/place-bet';
import { UserService } from '../user/user.service';
import { GameStatus } from './enums/game-status.enums';
import { parseMoney } from './utils/money';

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

  async placeBet(placeBetInput: PlaceBetInput) {
    if (this.gameState.status !== GameStatus.STARTED) {
      throw new Error('Cannot place a bet if the game has already started');
    }
    const user = await this.userService.findUserById(placeBetInput.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const betAmount = parseMoney(placeBetInput.betAmount);
    //fix neeeded because i decided to convert all balances to String to be precise;
    if (user.balance < betAmount) {
      throw new Error('The user balance is lower than the bet');
    }

    const constructedBet: Bet = {
      user: {
        id: user.id,
        username: user.username,
        photoUrl: user.photoUrl,
      },
      joinedAt: new Date(),
      betAmount: placeBetInput.betAmount,
      cashedOutAmount: null,
      cashedOutAt: null,
    };

    this.gameState.bets = [...this.gameState.bets, constructedBet];

    this.broadcastStateSync();
  }
}
