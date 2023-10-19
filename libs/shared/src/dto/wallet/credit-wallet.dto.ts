import { AmountWithCurrency } from '@app/shared/utils/amount-with-currency.dto';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class InitiateCreditWalletDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  amount: AmountWithCurrency;

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
