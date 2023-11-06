import { CreateIdeaConstantDto } from '@app/shared/dto/idea/create-idea-constant.dto';

export const defaultIdeaConstants: CreateIdeaConstantDto[] = [
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

export enum IdeaTypeEnum {
  FREE = 'FREE',
  VAULT = 'VAULT',
}

export enum IdeaNeedEnum {
  FUNDING = 'FUNDING',
  SALE = 'SALE',
  NEW_CONCEPT = 'NEW_CONCEPT',
}
