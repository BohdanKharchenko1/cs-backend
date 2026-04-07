import { GameState } from './game-state.model';
import { GameStatus } from '../enums/game-status.enums';

export function createInitialGameState(): GameState {
  return {
    id: crypto.randomUUID(),
    status: GameStatus.STARTED,
    createdAt: new Date(),
    startedAt: null,
    finishedAt: null,
    bets: [],
  };
}
