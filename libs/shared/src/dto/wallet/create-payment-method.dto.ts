import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  image: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  fields: string;

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}
