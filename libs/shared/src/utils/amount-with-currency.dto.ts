import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AmountWithCurrency {
  @IsString()
  @IsNotEmpty()
  currency: string;

  @Transform((value) => {
    console.log(value);
    return parseInt(`${value.value}`);
  })
  @IsNumber()
  value: number;
}
