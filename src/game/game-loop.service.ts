import { Injectable } from '@nestjs/common';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';
import { GameStatus } from './enums/game-status.enums';

@Injectable()
export class GameLoopService {
  private readonly bettingDelay: number;
  private readonly minimumPlayers: number;
  private bettingTimer: NodeJS.Timeout | null = null;
  constructor(
    private readonly gameService: GameService,
    private readonly configService: ConfigService,
  ) {
    this.bettingDelay = configService.getOrThrow('BETTING_DELAY');
    this.minimumPlayers = configService.getOrThrow('MINIMUM_PLAYERS');
  }
  startBettingCountdownIfNeeded() {
    const gameState = this.gameService.getStateSnapshot();

    if (gameState.bets.length < this.minimumPlayers) return;
    if (gameState.status !== GameStatus.WAITING_FOR_PLAYERS) return;
    if (this.bettingTimer) return;

    this.gameService.setGameStatus(GameStatus.BETTING_WAITING);

    this.bettingTimer = setTimeout(
      () => this.handleBettingCountdownFinished(),
      this.bettingDelay,
    );
  }
  handleBettingCountdownFinished() {
    const gameState = this.gameService.getStateSnapshot();

    if (gameState.status !== GameStatus.BETTING_WAITING) return;

    this.gameService.setGameStatus(GameStatus.IN_PROGRESS);
    this.bettingTimer = null;
  }
}
