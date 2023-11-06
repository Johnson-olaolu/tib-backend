import { UserModel } from './user.model';

export class ReportModel {
  id: string;

  user: UserModel;

  reporter: UserModel;

  reason: string;

  createdAt: Date;

  updatedAt: Date;
}
