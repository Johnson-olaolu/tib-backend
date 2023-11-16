import { LIkeTypeEnum } from 'apps/idea-service/src/utils/constants';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  ideaId: string;

  @IsString()
  @IsNotEmpty()
  commentId: string;

  @IsEnum(LIkeTypeEnum)
  type: LIkeTypeEnum;

  @IsString()
  @IsNotEmpty()
  comment: string;
}
