import { Module } from '@nestjs/common';
import { TonService } from './ton.service';
import { TonController } from './ton.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EventsGateway } from '../shared/websocket/events.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [TonController],
  providers: [TonService, EventsGateway],
})
export class TonModule {}
