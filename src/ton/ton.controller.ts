import { Body, Controller, Post } from '@nestjs/common';
import { TonService } from './ton.service';
import { TransactionPaymentDto } from './dto/transaction-payment.dto';

@Controller('ton')
export class TonController {
  constructor(private readonly tonService: TonService) {}
  @Post('payment')
  async handlePayment(@Body() transactionPayment: TransactionPaymentDto) {
    return this.tonService.handlePayment(transactionPayment);
  }
}
