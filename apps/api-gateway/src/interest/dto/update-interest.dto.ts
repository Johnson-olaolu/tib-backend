import { CreateInterestDto } from '@app/shared/dto/user-service/create-interest.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateInterestDto extends PartialType(CreateInterestDto) {}
