import { Module } from '@nestjs/common';
import { TonService } from './ton.service';
import { TonController } from './ton.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TonController],
  providers: [TonService],
})
export class TonModule {}
