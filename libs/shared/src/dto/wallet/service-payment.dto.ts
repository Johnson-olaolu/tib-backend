import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class ServicePaymentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  plan: string;
}
