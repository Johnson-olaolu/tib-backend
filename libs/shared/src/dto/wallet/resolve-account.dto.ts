import { IsNotEmpty, IsNumberString, IsString, Length } from 'class-validator';

export class ResolveAccountDto {
  @IsNumberString()
  @IsNotEmpty()
  bankCode: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(10, 10)
  accountNumber: string;
}
