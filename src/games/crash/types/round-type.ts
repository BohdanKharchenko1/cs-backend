import { GameType } from '../enums/game-type.enums';

export type RoundType =
  | { type: GameType.NONE }
  | { type: GameType.X2_PAYOUT; payoutMultiplier: number }
  | { type: GameType.BOOSTED_START; initialCoefficient: number };
