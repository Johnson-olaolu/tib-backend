import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class InitiateCreditWalletDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  @IsNotEmpty()
  paymentMethod: string;
}

export class ConfirmCreditWalletDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @IsNumber()
  @Min(100)
  amount: number;

  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
