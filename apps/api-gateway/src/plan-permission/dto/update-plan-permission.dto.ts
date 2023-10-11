import { PartialType } from '@nestjs/swagger';
import { CreatePlanPermissionDto } from './create-plan-permission.dto';

export class UpdatePlanPermissionDto extends PartialType(
  CreatePlanPermissionDto,
) {}
