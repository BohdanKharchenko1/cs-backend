import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('int', { unique: true })
  telegramId: number;
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
}
