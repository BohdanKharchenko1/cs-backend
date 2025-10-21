import { Injectable } from '@nestjs/common';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async updateWallet(updateWalletDto: UpdateWalletDto) {
    const { userId, wallet } = updateWalletDto;

    const result = await this.usersRepository.update({ id: userId }, {
      wallet,
    } as DeepPartial<User>);

    if (result.affected === 0) {
      throw new Error('User not found');
    }

    return { success: true };
  }
}
