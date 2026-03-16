import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameParticipant } from './entities/game-participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [GameController],
  providers: [GameService],
  imports: [TypeOrmModule.forFeature([Game, GameParticipant]), UserModule],
})
export class GameModule {}
