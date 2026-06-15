import { Bet, GameState } from '../state/game-state.model';

export type GamePersistenceUpdate = Pick<
  GameState,
  'id' | 'status' | 'createdAt' | 'startedAt' | 'finishedAt'
>;

export type ParticipantPersistenceUpdate = {
  gameId: GameState['id'];
  userId: Bet['user']['id'];
  joinedAt: Bet['joinedAt'];
  betAmount: Bet['betAmount'];
  cashedOutAmount: Bet['cashedOutAmount'];
  cashedOutMultiplier: Bet['cashedOutAt'];
};

export function mapGameStateToGameUpdate(
  gameState: GameState,
): GamePersistenceUpdate {
  return {
    id: gameState.id,
    status: gameState.status,
    createdAt: gameState.createdAt,
    startedAt: gameState.startedAt,
    finishedAt: gameState.finishedAt,
  };
}

export function mapBetToParticipantUpdate(
  gameId: GameState['id'],
  bet: Bet,
): ParticipantPersistenceUpdate {
  return {
    gameId,
    userId: bet.user.id,
    joinedAt: bet.joinedAt,
    betAmount: bet.betAmount,
    cashedOutAmount: bet.cashedOutAmount,
    cashedOutMultiplier: bet.cashedOutAt,
  };
}

export function mapGameStateToParticipantUpdates(
  gameState: GameState,
): ParticipantPersistenceUpdate[] {
  return gameState.bets.map((bet) =>
    mapBetToParticipantUpdate(gameState.id, bet),
  );
}
