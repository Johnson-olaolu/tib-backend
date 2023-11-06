import { IsNotEmpty, IsString } from 'class-validator';

export class ReportUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  reporterId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
