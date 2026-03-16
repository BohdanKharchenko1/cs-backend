import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ParsedUser } from '../auth/types/auth.types';
@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async findUserById(userId: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }
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
  async findOrCreateUser(parsedUser: ParsedUser): Promise<User> {
    await this.usersRepository.upsert(
      {
        telegramId: String(parsedUser.id),
        firstName: parsedUser?.first_name,
        lastName: parsedUser?.last_name,
        username: parsedUser?.username,
        photoUrl: parsedUser?.photo_url,
      },
      ['telegramId'],
    );

    const user = await this.usersRepository.findOne({
      where: {
        telegramId: String(parsedUser?.id),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
