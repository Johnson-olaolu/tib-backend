import { Inject, Injectable } from '@nestjs/common';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PlanModel } from './model/plan.model';
import { lastValueFrom } from 'rxjs';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';

@Injectable()
export class PlanService {
  constructor(
    @Inject(RABBITMQ_QUEUES.USER_SERVICE)
    private readonly userClient: ClientProxy,
  ) {}
  create(createPlanDto: CreatePlanDto) {
    return 'This action adds a new plan';
  }

  async findAll() {
    const plans = await lastValueFrom(
      this.userClient.send<PlanModel[]>('findAllPlan', {}),
    );
    return plans;
  }

  findOne(id: number) {
    return `This action returns a #${id} plan`;
  }

  update(id: number, updatePlanDto: UpdatePlanDto) {
    return `This action updates a #${id} plan`;
  }

  remove(id: number) {
    return `This action removes a #${id} plan`;
  }
}
