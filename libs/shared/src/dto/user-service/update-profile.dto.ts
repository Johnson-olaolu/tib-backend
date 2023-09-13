import { ArrayMinSize, IsNotEmpty, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ArrayMinSize(3)
  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  interests: string[];

  @IsString()
  @IsNotEmpty()
  bio: string;
}
