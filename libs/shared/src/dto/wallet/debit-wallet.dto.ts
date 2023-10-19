import { AmountWithCurrency } from '@app/shared/utils/amount-with-currency.dto';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsObject,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';

export class InitiateDebitWalletDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  amount: AmountWithCurrency;

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
