import { UserModel } from '@app/shared/model/user.model';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';

export class CreateCreditTransactionDto {
  @IsNumber()
  @Min(100)
  amount: number;

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
