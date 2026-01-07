import { Module } from '@nestjs/common';
import { TonService } from './ton.service';
import { TonController } from './ton.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { EventsGateway } from '../shared/websocket/events.gateway';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), PaymentModule],
  controllers: [TonController],
  providers: [TonService, EventsGateway],
})
export class TonModule {}
