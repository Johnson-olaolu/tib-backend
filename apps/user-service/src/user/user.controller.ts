import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';
import { ValidateUserDto } from '@app/shared/dto/user-service/validate-user.dto';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { ConfirmUserDto } from '@app/shared/dto/user-service/confirm-user.dto';
import { ChangePasswordDto } from '@app/shared/dto/user-service/change-password.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('createUser')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @EventPattern('generateConfirmEmailToken')
  async generateConfirmEmailToken(@Payload() userId: string) {
    await this.userService.generateNewConfirmAccountToken(userId);
  }

  @MessagePattern('confirmEmail')
  confirmEmail(@Payload() confirmUserDto: ConfirmUserDto) {
    return this.userService.confirmNewUser(confirmUserDto);
  }

  @EventPattern('generatePasswordResetToken')
  async generatePasswordResetToken(@Payload() email: string) {
    await this.userService.generatePasswordResetLink(email);
  }

  @MessagePattern('changePassword')
  async changePassword(@Payload() changePasswordDto: ChangePasswordDto) {
    return await this.userService.changePassword(changePasswordDto);
  }

  @MessagePattern('createProfile')
  createProfile(
    @Payload()
    {
      userId,
      createProfileDto,
    }: {
      userId: string;
      createProfileDto: UpdateProfileDto;
    },
  ) {
    return this.userService.updateProfile(userId, createProfileDto);
  }

  @MessagePattern('updateProfilePicture')
  updateProfilePicture(
    @Payload()
    { userId, file }: { userId: string; file: Express.Multer.File },
  ) {
    return this.userService.updateProfilePicture(userId, file);
  }

  @MessagePattern('findAllUser')
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern('getUserDetails')
  getUserDetails(@Payload() id: string) {
    return this.userService.getUserDetails(id);
  }

  @MessagePattern('updateUserProfile')
  updateUserProfile(
    @Payload()
    {
      id,
      updateProfileDto,
    }: {
      id: string;
      updateProfileDto: UpdateProfileDto;
    },
  ) {
    return this.userService.updateProfile(id, updateProfileDto);
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
