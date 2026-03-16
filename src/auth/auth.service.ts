import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  type InitData,
  isValid,
  parse,
  validate,
} from '@telegram-apps/init-data-node';
import { User } from '../user/entities/user.entity';
import { AuthSession } from './entities/auth-session.entity';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(AuthSession)
    private authSession: Repository<AuthSession>,
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
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
      where: { telegramId: String(parsedData.user.id) },
    });
    if (!user) {
      user = this.usersRepository.create({
        telegramId: String(parsedData.user.id),
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
  async authInit(initData: string) {
    //checks auth data was not tempered with
    if (!isValid(initData, this.configService.getOrThrow('BOT_TOKEN'))) {
      throw new UnauthorizedException('Invalid init data');
    }
    const parsedInitData: InitData = parse(initData);
    // check if necessary field id is present
    if (!parsedInitData.user?.id) {
      throw new UnauthorizedException('Missing user id');
    }
    const resultUserFromDb = await this.userService.findOrCreateUser(
      parsedInitData.user,
    );

    // returning mapped fields from db
    return {
      id: resultUserFromDb.id,
      telegramId: resultUserFromDb.telegramId,
      firstName: resultUserFromDb.firstName,
      lastName: resultUserFromDb.lastName,
      username: resultUserFromDb.username,
      photoUrl: resultUserFromDb.photoUrl,
      balance: resultUserFromDb.balance,
    };
  }
}
