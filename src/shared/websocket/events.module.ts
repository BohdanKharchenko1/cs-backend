import { Module } from '@nestjs/common';
import { GameModule } from '../../games/crash/game.module';

@Module({
  imports: [GameModule],
})
export class EventsModule {}
