import { IsNotEmpty, IsString } from 'class-validator';

export class BlockUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  blockedId: string;
}

export class UnBlockUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  blockId: string;
}
