import { IsString } from 'class-validator';

export class CreateIdeaConstantDto {
  @IsString()
  name: string;

  @IsString({
    each: true,
  })
  value: string[];
}
