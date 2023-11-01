import { AmountWithCurrency } from '@app/shared/utils/amount-with-currency.dto';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateIdeaSimpleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  categories?: string[];

  @IsOptional()
  media?: Express.Multer.File[];

  @IsOptional()
  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  collaborators?: string[];
}

export class CreateIdeaFundingNeededDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  categories: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  media: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  collaborators: string[];

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  @IsString()
  @IsNotEmpty()
  socialMediaLinks: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  competitors: string[];

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  valuation: AmountWithCurrency;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  executionCost: AmountWithCurrency;

  @IsString()
  @IsNotEmpty()
  ROITimeline: string;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  projectedRenue: AmountWithCurrency;

  @IsString()
  @IsNotEmpty()
  fundingStage: string;

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  totalMoneyRaised: AmountWithCurrency;
}
export class CreateIdeaForSaleDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  categories: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  media: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  collaborators: string[];

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  socialMediaLinks: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  competitors: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  @IsOptional()
  additionalAttachment: string[];

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  ideaCost: AmountWithCurrency;

  @IsString()
  @IsNotEmpty()
  sellingReason: string;
}
export class CreateIdeaNewConceptDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  categories: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  media: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  collaborators: string[];

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  website: string;

  @IsString()
  @IsNotEmpty()
  socialMediaLinks: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  competitors: string[];

  @ValidateNested()
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => AmountWithCurrency)
  executionCost: AmountWithCurrency;

  @IsString()
  @IsNotEmpty()
  seeking: string;
}
