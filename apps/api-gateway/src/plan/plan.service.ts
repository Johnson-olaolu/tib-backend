import { Inject, Injectable } from '@nestjs/common';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PlanModel } from './model/plan.model';
import { lastValueFrom } from 'rxjs';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { CreatePlanDto } from '@app/shared/dto/user-service/create-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @Inject(RABBITMQ_QUEUES.USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}
  async create(createPlanDto: CreatePlanDto) {
    const plan = await lastValueFrom(
      this.userClient.send<PlanModel>('createPlan', createPlanDto),
    );
    return plan;
  }

  async findAll() {
    const plans = await lastValueFrom(
      this.userClient.send<PlanModel[]>('findAllPlan', {}),
    );
    return plans;
  }

  async findOne(id: string) {
    const plan = await lastValueFrom(
      this.userClient.send<PlanModel>('findOnePlan', id),
    );
    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto) {
    const plan = await lastValueFrom(
      this.userClient.send<PlanModel>('updatePlan', {
        id,
        ...updatePlanDto,
      }),
    );
    return plan;
  }

  remove(id: string) {
    return `This action removes a #${id} plan`;
  }
}
