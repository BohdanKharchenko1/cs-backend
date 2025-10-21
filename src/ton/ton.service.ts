import { Injectable } from '@nestjs/common';
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
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async handlePayment(transactionPayment: TransactionPaymentDto) {
    const walletAddress = transactionPayment.account_id;
    const lt = transactionPayment.lt;
    const user = await this.usersRepository.findOne({
      where: { wallet: walletAddress },
    });
    if (!user) {
      return;
    }
    const url = `https://testnet.tonapi.io/v2/blockchain/transactions/${walletAddress}/${lt}`; //pomenyat na mainnet
    const { data } = await axios.get<TonTransaction>(url);

    const incoming = data.in_msg;
    const amountNano = incoming?.value ? Number(incoming.value) : 0;

    const amountTon = Number(amountNano) / 1_000_000_000;

    user.balance += amountTon;
    await this.usersRepository.save(user);

    return { success: true };
  }
}
