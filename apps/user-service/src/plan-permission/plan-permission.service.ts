import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanPermissionDto } from '../../../../libs/shared/src/dto/user-service/create-plan-permission.dto';
import { UpdatePlanPermissionDto } from './dto/update-plan-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlanPermision } from './entities/plan-permission.entity';
import { Repository } from 'typeorm';
import { threadId } from 'worker_threads';

@Injectable()
export class PlanPermissionService {
  constructor(
    @InjectRepository(PlanPermision)
    private planPermissionRepository: Repository<PlanPermision>,
  ) {}
  async create(createPlanPermissionDto: CreatePlanPermissionDto) {
    const planPermission = await this.planPermissionRepository.save(
      createPlanPermissionDto,
    );
    return planPermission;
  }

  async findAll() {
    const planPermissions = await this.planPermissionRepository.find();
    return planPermissions;
  }

  async findOne(id: string) {
    const planPermission = await this.planPermissionRepository.findOneBy({
      id,
    });
    if (!planPermission) {
      throw new NotFoundException(' Plan Permission not found for this ID');
    }
    return planPermission;
  }

  async findOneByName(name: string) {
    const planPermission = await this.planPermissionRepository.findOneBy({
      name,
    });
    if (!planPermission) {
      throw new NotFoundException(' Plan Permission not found for this name');
    }
    return planPermission;
  }

  async update(id: string, updatePlanPermissionDto: UpdatePlanPermissionDto) {
    const planPermission = await this.findOne(id);
    for (const permssionDetail in updatePlanPermissionDto) {
      planPermission[permssionDetail] =
        updatePlanPermissionDto[permssionDetail];
    }
    await planPermission.save();
    return planPermission;
  }

  async remove(id: string) {
    const deleteResponse = await this.planPermissionRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('PlanPermission not found for this ID');
    }
  }
}
