import { Injectable } from '@nestjs/common';
import { CreatePlanPermissionDto } from './dto/create-plan-permission.dto';
import { UpdatePlanPermissionDto } from './dto/update-plan-permission.dto';

@Injectable()
export class PlanPermissionService {
  create(createPlanPermissionDto: CreatePlanPermissionDto) {
    return 'This action adds a new planPermission';
  }

  findAll() {
    return `This action returns all planPermission`;
  }

  findOne(id: number) {
    return `This action returns a #${id} planPermission`;
  }

  update(id: number, updatePlanPermissionDto: UpdatePlanPermissionDto) {
    return `This action updates a #${id} planPermission`;
  }

  remove(id: number) {
    return `This action removes a #${id} planPermission`;
  }
}
