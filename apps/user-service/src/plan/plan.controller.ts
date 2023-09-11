import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PlanService } from './plan.service';
import { CreatePlanDto } from '../../../../libs/shared/src/dto/user-service/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Controller()
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @MessagePattern('createPlan')
  create(@Payload() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @MessagePattern('findAllPlan')
  findAll() {
    return this.planService.findAll();
  }

  @MessagePattern('findOnePlan')
  findOne(@Payload() id: string) {
    return this.planService.findOne(id);
  }

  @MessagePattern('updatePlan')
  update(@Payload() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(updatePlanDto.id, updatePlanDto);
  }

  @MessagePattern('removePlan')
  remove(@Payload() id: string) {
    return this.planService.remove(id);
  }
}
