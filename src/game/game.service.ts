import { Injectable } from '@nestjs/common';
import { createInitialGameState } from './state/game-state.factory';
import { Bet, GameState } from './state/game-state.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CashoutInput, PlaceBetInput } from './dto/in/place-bet';
import { UserService } from '../user/user.service';
import { GameStatus } from './enums/game-status.enums';
import { compareMoney, subtractMoney } from './utils/money';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { Repository } from 'typeorm';
import { GameParticipant } from './entities/game-participant.entity';
import { AppDataSource } from '../database/database.datasource';
import { User } from '../user/entities/user.entity';
import { wsError } from '../shared/websocket/ws-errors';
@Injectable()
export class GameService {
  gameState: GameState = createInitialGameState();

  constructor(
    private eventEmitter: EventEmitter2,
    private userService: UserService,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(GameParticipant)
    private gameParticipantsRepository: Repository<GameParticipant>,
  ) {}

  broadcastStateSync() {
    this.eventEmitter.emit('state_sync', this.gameState);
  }

  getStateSnapshot() {
    return this.gameState;
  }

  async placeBet(placeBetInput: PlaceBetInput): Promise<void> {
    if (this.gameState.status !== GameStatus.STARTED) {
      throw wsError.gameNotAcceptingBets();
    }
    const currentGame = await this.gameRepository.findOne({
      where: { id: this.gameState.id },
    });
    let constructedBet: Bet | null = null;

    if (!currentGame) {
      throw wsError.gameNotFound();
    }

    await AppDataSource.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.findOne(User, {
        where: { id: placeBetInput.userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw wsError.userNotFound();
      }
      if (compareMoney(user.balance, placeBetInput.betAmount) === -1) {
        throw wsError.insufficientBalance();
      }

      user.balance = subtractMoney(user.balance, placeBetInput.betAmount);

      constructedBet = {
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

      const gameParticipant = {
        betAmount: placeBetInput.betAmount,
        cashedOutAmount: null,
        cashedOutMultiplier: null,
        user: user,
        game: currentGame,
      };

      await transactionalEntityManager.save(gameParticipant);
      await transactionalEntityManager.save(user);
    });

    if (!constructedBet) {
      throw wsError.constructedBetMissing();
    }

    this.gameState.bets = [...this.gameState.bets, constructedBet];

    this.broadcastStateSync();
  }
  async cashout(userId: string): Promise<void> {
    if (this.gameState.status !== GameStatus.IN_PROGRESS) {
      throw new Error('Cannot cashout if the game isnt running');
    }
  }
}
