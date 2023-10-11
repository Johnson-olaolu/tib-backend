import { InterestModel } from './interest.model';

export class ProfileModel {
  id: string;

  firstName: string;

  lastName: string;

  profilePicture: string;

  interests: InterestModel[];

  bio: string;

  createdAt: Date;

  updatedAt: Date;
}
