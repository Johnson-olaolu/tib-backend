import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @IsString() @IsNotEmpty() email: string;
  @IsString() @IsNotEmpty() token: string;
}
