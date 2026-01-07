/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
import { Injectable, Logger } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TonTransaction,
  TransactionPaymentDto,
} from './dto/transaction-payment.dto';
import axios from 'axios';
import { EventsGateway } from '../shared/websocket/events.gateway';
import { PaymentService } from '../payment/payment.service';
import { TransactionType } from '../payment/enums/transaction.enums';

@Injectable()
export class TonService {
  private readonly logger = new Logger(TonService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly eventsGateway: EventsGateway,
    private paymentService: PaymentService,
  ) {}

  async handlePayment(transactionPayment: TransactionPaymentDto) {
    this.logger.log(
      `Ton webhook incoming: ${JSON.stringify(transactionPayment)}`,
    );

    const walletAddress = transactionPayment.account_id;
    const tx = transactionPayment.tx_hash;
    const url = `https://testnet.tonapi.io/v2/accounts/${walletAddress}/events/${tx}`; //pomenyat na mainnet
    this.logger.log(`Fetching transaction from TON API: ${url}`);
    const { data } = await axios.get<TonTransaction>(url);
    this.logger.debug(`Transaction data: ${JSON.stringify(data)}`);

    const incoming = (data as any).actions.find(
      (a: any) =>
        a.type === 'TonTransfer' &&
        a.status === 'ok' &&
        a.TonTransfer?.recipient?.address === walletAddress,
    );

    const amountNano = Number(incoming?.TonTransfer?.amount || 0);
    const amountTon = amountNano / 1_000_000_000;
    const userWallet = incoming?.TonTransfer?.sender?.address;

    this.logger.log(`Looking for user with wallet: ${walletAddress}`);

    const user = await this.usersRepository.findOne({
      where: { wallet: userWallet },
    });

    if (!user) {
      this.logger.warn(`No user found for wallet ${walletAddress}`);
      return { success: false, reason: 'User not found' };
    }

    try {
      this.logger.log(
        `Incoming amount: ${amountTon} TON from ${incoming?.source}`,
      );

      user.balance = Number(user.balance) + amountTon;
      await this.usersRepository.save(user);

      this.eventsGateway.sendBalanceUpdate(user.id, user.balance);
      await this.paymentService.createTransaction({
        amount: amountTon,
        type: TransactionType.TOP_UP,
        user: user,
      });
      this.logger.log(`Updated balance for user ${user.id}: ${user.balance}`);
      return { success: true };
    } catch (err) {
      this.logger.error(`TON API request failed`, err);
      return { success: false, error: 'TON API request failed' };
    }
  }
}
