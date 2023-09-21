import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreditWalletDto {
  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}
