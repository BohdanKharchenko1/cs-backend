import { Injectable, Logger } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TonTransaction,
  TransactionPaymentDto,
} from './dto/transaction-payment.dto';
import axios from 'axios';

@Injectable()
export class TonService {
  private readonly logger = new Logger(TonService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async handlePayment(transactionPayment: TransactionPaymentDto) {
    this.logger.log(
      `🔔 Received TON webhook: ${JSON.stringify(transactionPayment)}`,
    );

    const walletAddress = transactionPayment.account_id;
    const lt = transactionPayment.lt;

    this.logger.log(`Looking for user with wallet: ${walletAddress}`);

    const user = await this.usersRepository.findOne({
      where: { wallet: walletAddress },
    });

    if (!user) {
      this.logger.warn(`❌ No user found for wallet ${walletAddress}`);
      return { success: false, reason: 'User not found' };
    }

    const url = `https://testnet.tonapi.io/v2/blockchain/transactions/${walletAddress}/${lt}`;
    this.logger.log(`Fetching transaction from TON API: ${url}`);

    try {
      const { data } = await axios.get<TonTransaction>(url);
      this.logger.debug(`Transaction data: ${JSON.stringify(data)}`);

      const incoming = data.in_msg;
      const amountNano = incoming?.value ? Number(incoming.value) : 0;
      const amountTon = amountNano / 1_000_000_000;

      this.logger.log(
        `💰 Incoming amount: ${amountTon} TON from ${incoming?.source}`,
      );

      user.balance += amountTon;
      await this.usersRepository.save(user);

      this.logger.log(
        `✅ Updated balance for user ${user.id}: ${user.balance}`,
      );
      return { success: true };
    } catch (err) {
      this.logger.error(`⚠️ TON API request failed`, err);
      return { success: false, error: 'TON API request failed' };
    }
  }
}
