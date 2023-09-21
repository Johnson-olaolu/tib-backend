import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePaymentMethodDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  image: Express.Multer.File;

  @IsArray()
  fields: string[];

  @IsBoolean()
  @IsOptional()
  disabled?: boolean;
}
