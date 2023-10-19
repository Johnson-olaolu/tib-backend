import { UserModel } from '@app/shared/model/user.model';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';
import { Type } from 'class-transformer';
import { AmountWithCurrency } from '@app/shared/utils/amount-with-currency.dto';

export class CreateCreditTransactionDto {
  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  amount: AmountWithCurrency;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsObject()
  @IsNotEmptyObject()
  user: UserModel;

  @IsObject()
  @IsNotEmptyObject()
  wallet: Wallet;

  @IsObject()
  @IsNotEmptyObject()
  paymentMethod: PaymentMethod;
}
export class CreateDebitTransactionDto {
  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  amount: AmountWithCurrency;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsObject()
  @IsNotEmptyObject()
  user: UserModel;

  @IsObject()
  @IsNotEmptyObject()
  wallet: Wallet;

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
