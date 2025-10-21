import { Injectable, Logger } from '@nestjs/common';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async updateWallet(updateWalletDto: UpdateWalletDto) {
    const { userId, wallet } = updateWalletDto;
    const isExisting = await this.usersRepository.findOne({
      where: { wallet: wallet },
    });
    if (isExisting) {
      await this.usersRepository.update(
        { id: isExisting.id },
        { wallet: null },
      );
    }

    const result = await this.usersRepository.update({ id: userId }, {
      wallet,
    } as DeepPartial<User>);

    if (result.affected === 0) {
      this.logger.warn(`User not found for id=${userId}`);
      throw new Error('User not found');
    }

    return { success: true };
  }
}
