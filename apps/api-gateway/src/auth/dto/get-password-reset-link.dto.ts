import { IsEmail, IsString } from 'class-validator';

export class GetPasswordResetLinkDto {
  @IsEmail()
  email: string;
}
