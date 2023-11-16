import { LIkeTypeEnum } from 'apps/idea-service/src/utils/constants';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class GetCommentsDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEnum(LIkeTypeEnum)
  type: LIkeTypeEnum;
}
