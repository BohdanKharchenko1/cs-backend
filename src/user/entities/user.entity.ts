import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReferralOptions } from './referral-options.entity';
import { Transaction } from '../../payment/entities/transaction.entity';
import { GameParticipant } from '../../game/entities/game-participant.entity';
import { AuthSession } from '../../auth/entities/auth-session.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('bigint', { unique: true })
  telegramId: string;
  @Column('varchar', { length: 255, nullable: true })
  firstName: string;
  @Column('varchar', { length: 255, nullable: true })
  lastName: string;
  @Column('varchar', { length: 255, nullable: true })
  username: string;
  @Column('varchar', { length: 255, nullable: true })
  photoUrl: string;
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
  @Column('varchar', { length: 255, nullable: true })
  wallet: string | null;
  @Column('decimal', { precision: 18, scale: 9, default: 0 })
  balance: string;
  @Column('uuid', { nullable: true })
  referrerId: string;
  @ManyToOne(() => ReferralOptions, (ReferralOptions) => ReferralOptions.users)
  referralOptions: ReferralOptions;
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
  @OneToMany(() => GameParticipant, (gameParticipant) => gameParticipant.user)
  gameParticipants: GameParticipant[];
  @OneToMany(() => AuthSession, (authSession) => authSession.user)
  authSessions: AuthSession[];
}
