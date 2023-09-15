import { FileTypeEnum } from '@app/shared/utils/constants';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { IsFile } from 'nestjs-form-data';

export class SaveFileDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FileTypeEnum)
  type: FileTypeEnum;

  @IsString()
  @IsNotEmpty()
  parent: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  mimetype: string;

  @IsFile()
  file: Express.Multer.File;
}
