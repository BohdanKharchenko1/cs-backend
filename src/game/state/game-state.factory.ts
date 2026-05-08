import { GameState } from './game-state.model';
import { GameStatus } from '../enums/game-status.enums';

export function createInitialGameState(): GameState {
  return {
    id: crypto.randomUUID(),
    status: GameStatus.STARTED,
    createdAt: new Date(),
    coefficient: 1.0,
    startedAt: null,
    finishedAt: null,
    bets: [],
  };
}
