import { IsNotEmpty, IsString } from 'class-validator';

export class CreateIdeaDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  decription: string;

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  categories: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  media: string[];

  @IsString({
    each: true,
  })
  @IsNotEmpty({
    each: true,
  })
  collaborators: string[];
}
