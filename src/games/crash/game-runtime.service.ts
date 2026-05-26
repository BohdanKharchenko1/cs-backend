import { GameService } from './game.service';
import { GameLoopService } from './game-loop.service';
import { PlaceBetInput } from './types/place-bet';
import { Injectable } from '@nestjs/common';
import { GameState } from './state/game-state.model';

@Injectable()
export class GameRuntimeService {
  constructor(
    private readonly gameService: GameService,
    private readonly gameLoopService: GameLoopService,
  ) {}
  async placeBet(placeBetInput: PlaceBetInput): Promise<void> {
    await this.gameService.placeBet(placeBetInput);
    this.gameLoopService.startBettingCountdownIfNeeded();
  }
  async cashout(userId: string): Promise<void> {
    await this.gameService.cashout(userId);
  }
  getStateSnapshot(): GameState {
    return this.gameService.getStateSnapshot();
  }
}
