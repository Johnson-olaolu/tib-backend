import { Exclude, instanceToPlain } from 'class-transformer';
import { ProfileModel } from '../../../../apps/api-gateway/src/user/model/profile.model';

export class UserModel {
  id: string;

  userName: string;

  email: string;

  isEmailVerified: boolean;

  password: string;

  profile?: ProfileModel;

  roleName: string;

  planName: string;

  createdAt: Date;

  updatedAt: Date;
}
