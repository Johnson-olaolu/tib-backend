import { PartialType } from '@nestjs/mapped-types';
import { CreateIdeaConstantDto } from './create-idea-constant.dto';

export class UpdateIdeaConstantDto extends PartialType(CreateIdeaConstantDto) {
  id?: string;
}
