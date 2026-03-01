import { GameStatus } from '../enums/game-status.enums';

export type GameState = {
  id: string;
  status: GameStatus;
  startedAt: Date;
  players: Players[] | null;
};
type Players = {
  username: string;
  betAmount: string;
  cashedOut: string | null;
};
