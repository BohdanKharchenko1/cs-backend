import { GameState } from './game-state.model';
import { v4 as uuidv4 } from 'uuid';
import { GameStatus } from '../enums/game-status.enums';

export function createInitialGameState(): GameState {
  return {
    id: uuidv4(),
    status: GameStatus.STARTED,
    createdAt: new Date(),
    startedAt: null,
    finishedAt: null,
    bets: [],
  };
}
