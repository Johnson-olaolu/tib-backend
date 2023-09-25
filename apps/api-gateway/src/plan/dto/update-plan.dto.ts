import { CreatePlanDto } from '@app/shared/dto/user-service/create-plan.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}
