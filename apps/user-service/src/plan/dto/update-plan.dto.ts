import { PartialType } from '@nestjs/mapped-types';
import { CreatePlanDto } from '../../../../../libs/shared/src/dto/user-service/create-plan.dto';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  id: string;
}
