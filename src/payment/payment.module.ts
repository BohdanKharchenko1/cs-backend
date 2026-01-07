import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Transaction } from './entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [],
  providers: [PaymentService],
  imports: [TypeOrmModule.forFeature([Transaction])],
  exports: [PaymentService],
})
export class PaymentModule {}
