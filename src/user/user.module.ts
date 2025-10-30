import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ReferralOptions } from './entities/referral-options.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ReferralOptions])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
