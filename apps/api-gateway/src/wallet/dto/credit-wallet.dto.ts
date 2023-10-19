import { AmountWithCurrency } from '@app/shared/utils/amount-with-currency.dto';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreditWalletDto {
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
