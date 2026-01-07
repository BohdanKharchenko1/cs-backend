import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionType } from '../enums/transaction.enums';
import { User } from '../../user/entities/user.entity';

@Entity('transaction')
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column('decimal', { precision: 18, scale: 9 })
  amount: number;

  @Column('timestamptz', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('enum', { enum: TransactionType })
  type: TransactionType;

  @ManyToOne(() => User, (user) => user.transactions)
  user: User;
}
