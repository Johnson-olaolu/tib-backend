import { PartialType } from '@nestjs/mapped-types';
import { CreateRoleDto } from '../../../../../libs/shared/src/dto/user-service/create-role.dto';

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
  id: string;
}
