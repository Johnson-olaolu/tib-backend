import { CategoryModel } from './category.model';

export class ProfileModel {
  id: string;

  firstName: string;

  lastName: string;

  profilePicture: string;

  backgroundPicture: string;

  interests: CategoryModel[];

  bio: string;

  createdAt: Date;

  updatedAt: Date;
}
