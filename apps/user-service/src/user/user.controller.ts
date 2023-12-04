import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';
import { ValidateUserDto } from '@app/shared/dto/user-service/validate-user.dto';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { ConfirmUserDto } from '@app/shared/dto/user-service/confirm-user.dto';
import { ChangePasswordDto } from '@app/shared/dto/user-service/change-password.dto';
import { UpgradePlanDto } from '@app/shared/dto/user-service/upgrade-plan.dto';
import { QueryUserDto } from '@app/shared/dto/user-service/query-user.dto';
import {
  FetchFollowsDto,
  FollowUserDto,
  HandleFollowDto,
} from '@app/shared/dto/user-service/follow-user.dto';
import {
  BlockUserDto,
  UnBlockUserDto,
} from '@app/shared/dto/user-service/block-user.dto';
import { ReportUserDto } from '@app/shared/dto/user-service/report-user.dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('createUser')
  async createUser(@Payload() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @EventPattern('generateConfirmEmailToken')
  async generateConfirmEmailToken(@Payload() userId: string) {
    await this.userService.generateNewConfirmUserEmailToken(userId);
  }

  @MessagePattern('confirmEmail')
  async confirmEmail(@Payload() confirmUserDto: ConfirmUserDto) {
    return await this.userService.confirmUserEmail(confirmUserDto);
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

  @MessagePattern('updateBackgroundPicture')
  updateBackgroundPicture(
    @Payload()
    { userId, file }: { userId: string; file: Express.Multer.File },
  ) {
    return this.userService.updateBackgroundPicture(userId, file);
  }

  @MessagePattern('findAllUser')
  findAll() {
    return this.userService.findAll();
  }

  @MessagePattern('findOneUser')
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern('queryUser')
  query(@Payload() query: QueryUserDto) {
    return this.userService.query(query);
  }

  @MessagePattern('getUserDetails')
  getUserDetails(@Payload() id: string) {
    return this.userService.getUserDetails(id);
  }

  @MessagePattern('updateUserProfile')
  updateUserProfile(
    @Payload()
    {
      userId,
      updateProfileDto,
    }: {
      userId: string;
      updateProfileDto: UpdateProfileDto;
    },
  ) {
    return this.userService.updateProfile(userId, updateProfileDto);
  }

  @MessagePattern('upgradeUserPlan')
  upgradeUserPlan(@Payload() upgradePlanDto: UpgradePlanDto) {
    return this.userService.upgradeUserPlan(upgradePlanDto);
  }

  @MessagePattern('findOneUserByEmailOrUserName')
  findOneByEmailOrUserName(@Payload() emailOrUserName: string) {
    return this.userService.findOneByEmailOrUserName(emailOrUserName);
  }

  @MessagePattern('validateUser')
  validateUser(@Payload() validateUserDto: ValidateUserDto) {
    return this.userService.validateUser(validateUserDto);
  }

  @MessagePattern('followUser')
  followUser(@Payload() followUserDto: FollowUserDto) {
    return this.userService.followUser(followUserDto);
  }

  @MessagePattern('unFollowUser')
  unFollowUser(@Payload() followUserDto: FollowUserDto) {
    return this.userService.unfollowUser(followUserDto);
  }

  @MessagePattern('checkIfFollowing')
  checkIfFollowing(@Payload() followUserDto: FollowUserDto) {
    return this.userService.checkIfFollowing(followUserDto);
  }

  @MessagePattern('handleFollow')
  handleFollow(@Payload() handleFollowDto: HandleFollowDto) {
    return this.userService.handleFollow(handleFollowDto);
  }

  @MessagePattern('fetchUserFollows')
  fetchUserFollows(@Payload() fetchFollowsDto: FetchFollowsDto) {
    return this.userService.fetchUserFollows(fetchFollowsDto);
  }

  @MessagePattern('fetchInterestFollows')
  fetchInterestFollows(@Payload() interest: string) {
    return this.userService.fetchInterestFollows(interest);
  }

  @MessagePattern('blockUser')
  blockUser(@Payload() blockUserDto: BlockUserDto) {
    return this.userService.blockUser(blockUserDto);
  }

  @MessagePattern('unBlockUser')
  unBlockUser(@Payload() unBlockUserDto: UnBlockUserDto) {
    return this.userService.unBlockUser(unBlockUserDto);
  }

  @MessagePattern('fetchBlockedUsers')
  fetchBlockedUsers(@Payload() blockId: string) {
    return this.userService.fetchBlockedUsers(blockId);
  }

  @MessagePattern('reportUser')
  reportUser(@Payload() reportUserDto: ReportUserDto) {
    return this.userService.reportUser(reportUserDto);
  }

  @MessagePattern('removeUser')
  remove(@Payload() id: string) {
    return this.userService.remove(id);
  }
}
