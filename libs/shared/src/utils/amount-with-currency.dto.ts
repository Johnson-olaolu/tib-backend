import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AmountWithCurrency {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @IsNumber()
  value: number;
}
