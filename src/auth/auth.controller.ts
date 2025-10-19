import {
  Controller,
  Post,
  Headers,
  UnauthorizedException,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async login(@Body('initData') authorization?: string) {
    if (!authorization) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    return this.authService.validateTgUser(authorization);
  }
}
