import { CreateRoleDto } from '@app/shared/dto/user-service/create-role.dto';
import { CreatePlanPermissionDto } from '@app/shared/dto/user-service/create-plan-permission.dto';
import { CreatePlanDto } from '@app/shared/dto/user-service/create-plan.dto';
import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';

export const BCRYPT_HASH_ROUND = 2;
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
    active: false,
    planPermissions: [
      'Buy Idea',
      'Sell Idea',
      'Deposit Idea',
      'Chat with ideator',
    ],
  },
];

interface IDefaultSuperAdmin extends CreateUserDto {
  isEmailVerified: boolean;
  role: string;
  plan: string;
}
export const defaultSuperAdmin: IDefaultSuperAdmin = {
  email: 'super-admin@tib.com',
  password: 'Test_123',
  userName: 'SuperAdmin',
  isEmailVerified: true,
  role: 'super_admin',
  plan: 'Enterprise',
};
