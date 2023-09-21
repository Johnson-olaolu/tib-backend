import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
  validateSync,
} from 'class-validator';

class CardFields {
  @IsString()
  @IsNotEmpty()
  cardName: string;

  @IsString()
  //   @Matches(
  //     '^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35d{3})d{11})$',
  //   )
  @MinLength(14)
  cardNumber: string;

  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)
  expiryDate: string;

  @IsString()
  @Length(3, 3)
  cvv: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(CardFields, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
