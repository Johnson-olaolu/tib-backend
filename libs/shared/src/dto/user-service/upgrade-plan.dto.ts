import { IsNotEmpty, IsString } from 'class-validator';

export class UpgradePlanDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  plan: string;
}
