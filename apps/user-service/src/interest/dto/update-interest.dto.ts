import { CreateInterestDto } from '@app/shared/dto/user-service/create-interest.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateInterestDto extends PartialType(CreateInterestDto) {
  id: string;
}
