import { GameService } from './game.service';
import { GameLoopService } from './game-loop.service';
import { PlaceBetInput } from './dto/in/place-bet';

export class GameRuntimeService {
  constructor(
    private readonly gameService: GameService,
    private readonly gameLoopService: GameLoopService,
  ) {}
  async placeBet(placeBetInput: PlaceBetInput): Promise<void> {
    await this.gameService.placeBet(placeBetInput);
    this.gameLoopService.startBettingCountdownIfNeeded();
  }
}
