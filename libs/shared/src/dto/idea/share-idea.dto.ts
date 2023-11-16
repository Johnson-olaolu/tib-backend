import { LIkeTypeEnum } from 'apps/idea-service/src/utils/constants';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ShareIdeaDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  ideaId?: string;

  @IsEnum(LIkeTypeEnum)
  type: LIkeTypeEnum;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  commentId?: string;
}
