import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailAPIDto {
  @IsString() @IsNotEmpty() token: string;
}
