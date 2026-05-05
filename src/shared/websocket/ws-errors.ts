import { WsException } from '@nestjs/websockets';

export const wsError = {
  unauthorized: () =>
    new WsException({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
    }),

  userNotFound: () =>
    new WsException({
      code: 'USER_NOT_FOUND',
      message: 'User not found',
    }),

  gameNotFound: () =>
    new WsException({
      code: 'GAME_NOT_FOUND',
      message: 'Game not found',
    }),

  gameNotAcceptingBets: () =>
    new WsException({
      code: 'GAME_NOT_ACCEPTING_BETS',
      message: 'Game is not accepting bets right now',
    }),

  insufficientBalance: () =>
    new WsException({
      code: 'INSUFFICIENT_BALANCE',
      message: 'Insufficient balance',
    }),

  gameNotRunning: () =>
    new WsException({
      code: 'GAME_NOT_RUNNING',
      message: 'Game is not running',
    }),

  betNotFound: () =>
    new WsException({
      code: 'BET_NOT_FOUND',
      message: 'Bet not found',
    }),

  betExists: () =>
    new WsException({
      code: 'BET_EXISTS',
      message: 'Bet exists',
    }),

  constructedBetMissing: () =>
    new WsException({
      code: 'CONSTRUCTED_BET_MISSING',
      message: 'Constructed bet remained empty',
    }),
};
