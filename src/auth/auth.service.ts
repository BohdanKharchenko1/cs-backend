import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { validate, parse } from '@telegram-apps/init-data-node';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}
  async validateTgUser(
    initData: string,
  ): Promise<{ token: string; user: User }> {
    validate(initData, process.env.BOT_TOKEN!);
    const parsedData = parse(initData);
    if (!parsedData.user) {
      throw new UnauthorizedException('Invalid User');
    }
    let user = await this.usersRepository.findOne({
      where: { telegramId: parsedData.user.id },
    });
    if (!user) {
      user = this.usersRepository.create({
        telegramId: parsedData.user.id,
        firstName: parsedData.user.first_name,
        lastName: parsedData.user.last_name,
        username: parsedData.user.username,
        photoUrl: parsedData.user.photo_url,
      } as DeepPartial<User>);
    }
    await this.usersRepository.save(user);

    const payload = { sub: user.id, telegramId: user.telegramId };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1d',
    });

    return { token, user };
  }
}
