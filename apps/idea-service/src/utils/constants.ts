import { CreateIdeaConstantDto } from '@app/shared/dto/idea/create-idea-constant.dto';
import { CreateCategoryDto } from '@app/shared/dto/user-service/create-category.dto';

export const defaultIdeaConstants: CreateIdeaConstantDto[] = [
  {
    name: 'Need',
    value: ['Partnership', 'Mentorship', 'Capital'],
  },
  {
    name: 'Funding Stage',
    value: ['Seed Stage', 'Series A', 'Series B'],
  },
  {
    name: 'Estimated ROI Timeline',
    value: ['0 - 3 Months', '3 - 12 Months', '12 - 36 Months'],
  },
  {
    name: 'Role',
    value: ['I own this idea', "I'm part of a team"],
  },
];

export enum LIkeTypeEnum {
  IDEA = 'IDEA',
  COMMENT = 'COMMENT',
}

export enum IdeaTypeEnum {
  FREE = 'FREE',
  VAULT = 'VAULT',
}

export enum IdeaNeedEnum {
  FUNDING = 'FUNDING',
  SALE = 'SALE',
  NEW_CONCEPT = 'NEW_CONCEPT',
}

export const defaultCategories: CreateCategoryDto[] = [
  { name: 'Cartoons', description: 'Cartoons' },
  { name: 'Science', description: 'Science' },
  { name: 'Marriage', description: 'Marraige' },
  { name: 'Technology', isTopCategory: true, description: 'Technology' },
  { name: 'Art', isTopCategory: true, description: 'Art' },
  { name: 'Entertainment', isTopCategory: true, description: 'Entertainment' },
  { name: 'Finance', isTopCategory: true, description: 'Finance' },
  { name: 'Music', isTopCategory: true, description: 'Music' },
];
