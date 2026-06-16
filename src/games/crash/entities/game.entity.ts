import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { GameStatus } from '../enums/game-status.enums';
import { GameParticipant } from './game-participant.entity';
import { GameType } from '../enums/game-type.enums';
@Entity('games')
export class Game extends BaseEntity {
  @PrimaryColumn('string')
  id: string;
  @Column({ type: 'timestamptz' })
  createdAt: Date;
  @Column({ type: 'timestamptz', nullable: true, default: null })
  startedAt: Date | null;
  @Column({ type: 'timestamptz', nullable: true, default: null })
  finishedAt: Date | null;
  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING_FOR_PLAYERS,
  })
  status: GameStatus;
  @Column({ type: 'enum', enum: GameType, nullable: true, default: null })
  gameType: GameType | null;
  @OneToMany(() => GameParticipant, (gameParticipant) => gameParticipant.game)
  participants: GameParticipant[];
}
