import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
