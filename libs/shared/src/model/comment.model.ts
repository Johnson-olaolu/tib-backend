import { LIkeTypeEnum } from 'apps/idea-service/src/utils/constants';

export class CommentModel {
  id: string;

  userId: string;

  comment: string;

  type: LIkeTypeEnum;

  children?: Comment[];

  createdAt: Date;

  updatedAt: Date;
}
