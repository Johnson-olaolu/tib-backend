import { TransferTypesEnum, currencies } from '@app/shared/utils/constants';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TransferMoneyDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @IsString()
  @IsNotEmpty()
  recieverId: string;

  @IsNumber()
  @Min(100)
  amount: number;

  @IsEnum(TransferTypesEnum)
  transferType: TransferTypesEnum;

  @IsIn(currencies)
  @IsOptional()
  currency?: (typeof currencies)[number];
}
