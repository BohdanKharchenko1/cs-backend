import { GameStatus } from '../enums/game-status.enums';

export type GameState = {
  id: string;
  status: GameStatus;
  createdAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
  bets: Bet[] | null;
};

export type Bet = {
  user: User;
  joinedAt: Date;
  betAmount: string;
  cashedOutAt: string | null;
  cashedOutAmount: string | null;
};

export type User = {
  id: string;
  username: string;
  photoUrl: string;
};
