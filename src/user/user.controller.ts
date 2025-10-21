import { Controller, Get, Post, Body, Patch, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateWalletDto } from './dto/update-wallet.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('/updateWallet')
  create(@Body() updateWallet: UpdateWalletDto) {
    return this.userService.updateWallet(updateWallet);
  }
}
