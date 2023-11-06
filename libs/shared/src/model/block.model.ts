import { UserModel } from './user.model';

export class BlockModel {
  id: string;

  user: UserModel;

  blocked: UserModel;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}
