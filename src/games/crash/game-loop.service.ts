import { Injectable } from '@nestjs/common';
import { GameService } from './game.service';
import { ConfigService } from '@nestjs/config';
import { GameStatus } from './enums/game-status.enums';

@Injectable()
export class GameLoopService {
  private readonly bettingDelay: number;
  private readonly minimumPlayers: number;
  private readonly crashedDelay: number;
  private bettingTimer: NodeJS.Timeout | null = null;
  private crashTimer: NodeJS.Timeout | null = null;
  private crashedTimer: NodeJS.Timeout | null = null;
  private coefficientTimer: NodeJS.Timeout | null = null;
  constructor(
    private readonly gameService: GameService,
    private readonly configService: ConfigService,
  ) {
    this.bettingDelay = Number(configService.getOrThrow('BETTING_DELAY'));
    this.minimumPlayers = Number(configService.getOrThrow('MINIMUM_PLAYERS'));
    this.crashedDelay = Number(configService.getOrThrow('CRASHED_DELAY'));
  }
  startBettingCountdownIfNeeded() {
    const gameState = this.gameService.getStateSnapshot();

    if (gameState.bets.length < this.minimumPlayers) return;
    if (gameState.status !== GameStatus.WAITING_FOR_PLAYERS) return;
    if (this.bettingTimer) return;

    this.gameService.setGameStatus(GameStatus.BETTING_WAITING);

    this.bettingTimer = setTimeout(
      () => this.startBettingCountdownFinished(),
      this.bettingDelay,
    );
  }
  startBettingCountdownFinished() {
    const gameState = this.gameService.getStateSnapshot();

    if (gameState.status !== GameStatus.BETTING_WAITING) return;

    this.gameService.setGameStatus(GameStatus.IN_PROGRESS);
    this.bettingTimer = null;

    //need an update later - use actual generated time crash time
    this.startCrashTimer(100);
    this.startCoefficientUpdates();
  }
  startCrashTimer(crashTime: number) {
    this.crashTimer = setTimeout(() => {
      this.crashedTimer = null;
      void this.startCrashedPhase();
    }, crashTime);
  }
  startCoefficientUpdates() {
    let coefficient = 1.0;
    this.coefficientTimer = setInterval(() => {
      this.gameService.updateCoefficient(coefficient);
      coefficient += 0.1;
    }, 100); // rewrite later to find the best update time
  }
  async startCrashedPhase() {
    if (this.coefficientTimer) {
      clearInterval(this.coefficientTimer);
      this.coefficientTimer = null;
    }
    this.gameService.finishRound();
    await this.gameService.saveRoundResults();

    this.crashedTimer = setTimeout(() => {
      void this.gameService.startNewRound();
      this.crashTimer = null;
    }, this.crashedDelay);
  }
}
