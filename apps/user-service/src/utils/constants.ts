import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';
import { CreatePlanPermissionDto } from '../../../../libs/shared/src/dto/user-service/create-plan-permission.dto';
import { CreatePlanDto } from '../../../../libs/shared/src/dto/user-service/create-plan.dto';
import { CreateRoleDto } from '../../../../libs/shared/src/dto/user-service/create-role.dto';
import { CreateInterestDto } from '@app/shared/dto/user-service/create-interest.dto';

export enum FollowStatusEnum {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum PlanTypeEnum {
  FREE = 'FREE',
  PAID = 'PAID',
}

export const defaultRoles: CreateRoleDto[] = [
  { name: 'super_admin', description: 'Site Super Admin' },
  { name: 'admin', description: 'Site Admin' },
  { name: 'user', description: 'Site User' },
];

export const defaultPlanPermissions: CreatePlanPermissionDto[] = [
  { name: 'Buy Idea', description: 'Buy Idea' },
  { name: 'Sell Idea', description: 'Sell Idea' },
  { name: 'Deposit Idea', description: 'Deposit Idea' },
  { name: 'Chat with ideator', description: 'Chat with ideator' },
];

export const defaultPlans: CreatePlanDto[] = [
  {
    name: 'Free',
    description: 'Free Plan',
    type: PlanTypeEnum.FREE,
    planPermissions: [],
  },
  {
    name: 'Premium',
    description: 'Premium Plan',
    type: PlanTypeEnum.PAID,
    planPermissions: [
      'Buy Idea',
      'Sell Idea',
      'Deposit Idea',
      'Chat with ideator',
    ],
  },
  {
    name: 'Enterprise',
    description: 'Enterprise Plan',
    type: PlanTypeEnum.PAID,
    planPermissions: [
      'Buy Idea',
      'Sell Idea',
      'Deposit Idea',
      'Chat with ideator',
    ],
  },
];

export const defaultInterests: CreateInterestDto[] = [{ name: '' }];

// export const superAdmin: CreateUserDto = {};
