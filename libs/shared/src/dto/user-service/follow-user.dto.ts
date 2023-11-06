import { FollowStatusEnum } from 'apps/user-service/src/utils/constants';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class FollowUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  followerId: string;
}

export class HandleFollowDto {
  @IsString()
  @IsNotEmpty()
  followRequestId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(FollowStatusEnum)
  status: FollowStatusEnum;
}

export class FetchFollowsDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(FollowStatusEnum)
  status: FollowStatusEnum;
}
