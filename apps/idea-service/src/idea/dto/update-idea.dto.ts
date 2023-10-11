import { PartialType } from '@nestjs/mapped-types';
import { CreateIdeaDto } from '../../../../../libs/shared/src/dto/idea/create-idea.dto';

export class UpdateIdeaDto extends PartialType(CreateIdeaDto) {
  id: number;
}
