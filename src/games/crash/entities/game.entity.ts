import { BaseEntity, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { GameStatus } from '../enums/game-status.enums';
import { GameParticipant } from './game-participant.entity';
@Entity('games')
export class Game extends BaseEntity {
  @PrimaryColumn('string')
  id: string;
  @Column({ type: 'timestamptz' })
  createdAt: Date;
  @Column({ type: 'timestamptz', nullable: true, default: null })
  startedAt: Date;
  @Column({ type: 'timestamptz', nullable: true, default: null })
  finishedAt: Date;
  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING_FOR_PLAYERS,
  })
  status: GameStatus;
  @OneToMany(() => GameParticipant, (gameParticipant) => gameParticipant.game)
  participants: GameParticipant[];
}
