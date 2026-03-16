import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('auth_sessions')
export class AuthSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text', unique: true })
  tokenHash: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column({ type: 'timestamptz' })
  expiresAt: Date;
  @ManyToOne(() => User, (user) => user.authSessions, { onDelete: 'CASCADE' })
  user: User;
}
