import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';
import { ValidateUserDto } from '@app/shared/dto/user-service/validate-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('createUser')
  create(@Payload() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @MessagePattern('findAllUser')
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern('findOneUserByEmailOrUserName')
  findOneByEmailOrUserName(@Payload() emailOrUserName: string) {
    return this.userService.findOneByEmailOrUserName(emailOrUserName);
  }

  @MessagePattern('validateUser')
  validateUser(@Payload() validateUserDto: ValidateUserDto) {
    return this.userService.validateUser(validateUserDto);
  }

  @MessagePattern('updateUser')
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: string) {
    return this.userService.remove(id);
  }
}
