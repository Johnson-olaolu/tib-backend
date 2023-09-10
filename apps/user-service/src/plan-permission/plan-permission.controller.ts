import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlanPermissionService } from './plan-permission.service';
import { CreatePlanPermissionDto } from '../../../../libs/shared/src/dto/user-service/create-plan-permission.dto';
import { UpdatePlanPermissionDto } from './dto/update-plan-permission.dto';

@Controller()
export class PlanPermissionController {
  constructor(private readonly planPermissionService: PlanPermissionService) {}

  @MessagePattern('createPlanPermission')
  create(@Payload() createPlanPermissionDto: CreatePlanPermissionDto) {
    return this.planPermissionService.create(createPlanPermissionDto);
  }

  @MessagePattern('findAllPlanPermission')
  findAll() {
    return this.planPermissionService.findAll();
  }

  @MessagePattern('findOnePlanPermission')
  findOne(@Payload() id: string) {
    return this.planPermissionService.findOne(id);
  }

  @MessagePattern('updatePlanPermission')
  update(@Payload() updatePlanPermissionDto: UpdatePlanPermissionDto) {
    return this.planPermissionService.update(
      updatePlanPermissionDto.id,
      updatePlanPermissionDto,
    );
  }

  @MessagePattern('removePlanPermission')
  remove(@Payload() id: string) {
    return this.planPermissionService.remove(id);
  }
}
