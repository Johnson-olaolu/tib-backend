import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlanDto } from '../../../../libs/shared/src/dto/user-service/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanPermissionService } from '../plan-permission/plan-permission.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Plan } from './entities/plan.entity';
import { Repository } from 'typeorm';
import { PlanPermision } from '../plan-permission/entities/plan-permission.entity';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(Plan) private planRepository: Repository<Plan>,
    private planPermissionService: PlanPermissionService,
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    const planPermissions: PlanPermision[] = [];
    for (const planPermissionName of createPlanDto.planPermissions) {
      const planPermission = await this.planPermissionService.findOneByName(
        planPermissionName,
      );
      planPermissions.push(planPermission);
    }
    const createPlanDetails = {
      ...createPlanDto,
      planPermissions: planPermissions,
    };

    const newPlanPermissions = await this.planRepository.save(
      createPlanDetails,
    );
    return newPlanPermissions;
  }

  async findAll() {
    const plans = await this.planRepository.find();
    return plans;
  }

  async findOne(id: string) {
    const plan = await this.planRepository.findOneBy({ id });
    if (!plan) {
      throw new NotFoundException('Plan not found for this ID');
    }
    return plan;
  }

  async findOneByName(name: string) {
    const plan = await this.planRepository.findOneBy({ name });
    if (!plan) {
      throw new NotFoundException('Plan not found for this name');
    }
    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const plan = await this.findOne(id);

    let updatePlanDetails: any = updatePlanDto;
    if (updatePlanDto.planPermissions) {
      const planPermissions: PlanPermision[] = [];
      for (const planPermissionName in updatePlanDto.planPermissions) {
        const planPermission = await this.planPermissionService.findOneByName(
          planPermissionName,
        );
        planPermissions.push(planPermission);
      }
      updatePlanDetails = {
        ...updatePlanDto,
        planPermissions: planPermissions,
      };
    }

    for (const detail in updatePlanDetails) {
      plan[detail] = updatePlanDetails[detail];
    }
    await plan.save();
    return plan;
  }

  async remove(id: string) {
    const deleteResponse = await this.planRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('Plan not found for this ID');
    }
  }
}
