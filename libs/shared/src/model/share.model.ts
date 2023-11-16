import { LIkeTypeEnum } from 'apps/idea-service/src/utils/constants';

export class ShareModel {
  id: string;

  userId: string;

  type: LIkeTypeEnum;

  createdAt: Date;

  updatedAt: Date;
}
