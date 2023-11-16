import { LIkeTypeEnum } from 'apps/idea-service/src/utils/constants';

export class LikeModel {
  id: string;

  userId: string;

  type: LIkeTypeEnum;

  createdAt: Date;

  updatedAt: Date;
}
