import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  VERSION: string;

  @IsString()
  @IsNotEmpty()
  SECRET_KEY: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRATION_TIME: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_URL: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_USER_QUEUE: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_WALLET_QUEUE: string;

  @IsString()
  @IsNotEmpty()
  RABBITMQ_IDEA_QUEUE: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
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
