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
    type: 'numeric',
    precision: 18,
    scale: 9,
  })
  betAmount: string;
  @Column({
    type: 'numeric',
    precision: 18,
    scale: 9,
    nullable: true,
  })
  cashedOutAmount: string | null;
  @Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
  cashedOutMultiplier: string | null;
  @ManyToOne(() => Game, (game) => game.participants)
  game: Game;
  @ManyToOne(() => User, (user) => user.gameParticipants)
  user: User;
}
