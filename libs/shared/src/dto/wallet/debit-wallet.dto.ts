import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class InitiateDebitWalletDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @IsNumber()
  @Min(100)
  amount: number;

  @IsNumberString()
  @IsNotEmpty()
  bankCode: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10, 10)
  accountNumber: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;
}

export class ConfirmDebitWalletDto {
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
