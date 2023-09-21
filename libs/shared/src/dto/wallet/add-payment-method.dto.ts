import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class AddPaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  walletId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsObject()
  @IsNotEmptyObject()
  @IsOptional()
  fields: Record<string, unknown>;
}
