import { AmountWithCurrency } from '@app/shared/utils/amount-with-currency.dto';
import { SocialMediaLinks } from '@app/shared/utils/social-media-links.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
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

  @IsOptional()
  media?: Express.Multer.File[];

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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  website?: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SocialMediaLinks)
  socialMediaLinks?: SocialMediaLinks[];

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
  projectedRevenue: AmountWithCurrency;

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

  @IsOptional()
  media?: Express.Multer.File[];

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

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SocialMediaLinks)
  socialMediaLinks: SocialMediaLinks[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  competitors: string[];

  @IsOptional()
  additionalAttachment?: Express.Multer.File[];

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

  @IsOptional()
  media?: Express.Multer.File[];

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

  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => SocialMediaLinks)
  socialMediaLinks: SocialMediaLinks[];

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
