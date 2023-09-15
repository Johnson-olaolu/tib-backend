import { FileTypeEnum } from '@app/shared/utils/constants';

export class FileModel {
  id: string;

  name: string;

  path: string;

  Author: string;

  ownerId: string;

  title: string;

  type: FileTypeEnum;

  mimeType: string;

  public createdAt: Date;

  public updatedAt: Date;
}
