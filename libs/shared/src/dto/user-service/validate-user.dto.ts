import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ValidateUserDto {
  @IsString() @IsNotEmpty() usernameOrEmail: string;
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  password: string;
}
