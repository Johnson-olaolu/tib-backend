import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: string;
}
