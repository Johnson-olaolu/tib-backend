import { UserModel } from './user.model';

export class FollowModel {
  id: string;

  user: UserModel;

  follower: UserModel;

  status: string;

  createdAt: Date;

  updatedAt: Date;
}
