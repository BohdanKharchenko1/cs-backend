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

  constructedBetMissing: () =>
    new WsException({
      code: 'CONSTRUCTED_BET_MISSING',
      message: 'Constructed bet remained empty',
    }),
};
