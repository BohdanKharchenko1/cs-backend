import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ReferralOptions } from './referral-options.entity';
import { Transaction } from '../../payment/entities/transaction.entity';

@Entity('user')
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
  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column('varchar', { length: 255, nullable: true })
  wallet: string | null;
  @Column('decimal', { precision: 18, scale: 9, default: 0 })
  balance: number;
  @Column('uuid', { nullable: true })
  referrerId: string;
  @ManyToOne(() => ReferralOptions, (ReferralOptions) => ReferralOptions.users)
  referralOptions: ReferralOptions;
  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
