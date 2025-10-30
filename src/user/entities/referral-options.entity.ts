import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('referral_options')
export class ReferralOptions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('decimal', { precision: 5, scale: 3, default: 0 })
  percentageCommission: number;
  @OneToMany(() => User, (user) => user.referralOptions)
  users: User[];
}
