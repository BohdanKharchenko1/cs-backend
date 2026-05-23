import { Module } from '@nestjs/common';
import { GameRuntimeService } from '../../game/game-runtime.service';

@Module({
  imports: [GameRuntimeService],
})
export class EventsModule {}
