import { IsNotEmpty, IsString, Matches } from '@nestjs/class-validator';

export class PlaceBetMessageDto {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+(\.\d+)?$/)
  betAmount: string;
}
