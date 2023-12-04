import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class SocialMediaLinks {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUrl()
  url: number;
}
