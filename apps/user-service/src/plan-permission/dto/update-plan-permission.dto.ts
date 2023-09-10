import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanPermissionDto } from '../../../../../libs/shared/src/dto/user-service/create-plan-permission.dto';

export class UpdatePlanPermissionDto extends PartialType(
  CreatePlanPermissionDto,
) {
  id: string;
}
