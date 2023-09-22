import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class DebitWalletDto {
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
