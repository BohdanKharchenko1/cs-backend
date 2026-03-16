import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
import { User } from '../../user/entities/user.entity';

@Entity('game-participants')
export class GameParticipant extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @CreateDateColumn({ type: 'timestamptz' })
  joinedAt: Date;
  @Column({
    type: 'bigint',
  })
  betAmount: string;
  @Column({ type: 'bigint', nullable: true })
  cashedOutAmount: string | null;
  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  cashedOutAt: string | null;
  @ManyToOne(() => Game, (game) => game.participants)
  game: Game;
  @ManyToOne(() => User, (user) => user.gameParticipants)
  user: User;
}
