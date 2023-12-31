import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ProfileModel } from '../../../../libs/shared/src/model/profile.model';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';
import { WalletModel } from '@app/shared/model/wallet.model';
import { UpgradePlanDto } from '@app/shared/dto/user-service/upgrade-plan.dto';
import { UserModel } from '@app/shared/model/user.model';
import { QueryUserDto } from '@app/shared/dto/user-service/query-user.dto';
import { InterestModel } from '@app/shared/model/interest.model';
import { error } from 'console';

@Injectable()
export class UserService {
  constructor(
    @Inject(RABBITMQ_QUEUES.USER_SERVICE)
    private readonly userClient: ClientProxy,
    @Inject(RABBITMQ_QUEUES.WALLET_SERVICE)
    private readonly walletClient: ClientProxy,
  ) {}
  async updateUserProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    console.log(userId);
    const user = await lastValueFrom(
      this.userClient.send<ProfileModel>('updateUserProfile', {
        userId,
        updateProfileDto,
      }),
    );
    return user;
  }

  async updateUserProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await lastValueFrom(
      this.userClient.send<ProfileModel>('updateProfilePicture', {
        userId,
        file,
      }),
    );
    return user;
  }

  async getUserWalletDetails(userId: string) {
    const response = await lastValueFrom(
      this.walletClient.send<WalletModel>('getUserWalletDetails', userId),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return response;
  }
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async query(query: QueryUserDto) {
    const response = await lastValueFrom(
      this.userClient.send<UserModel[]>('queryUser', query),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return response;
  }

  async getUserDetails(id: string) {
    try {
      const user = await lastValueFrom(
        this.userClient.send('getUserDetails', id),
      );
      return user;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  async getUserInterests(id: string) {
    const interests = await lastValueFrom(
      this.userClient.send<InterestModel[]>('getUserInterest', id),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return interests;
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${userId} user`;
  }

  async upgradeUserPlan(
    userId: string,
    upgradeUserPlanDto: Omit<UpgradePlanDto, 'userId'>,
  ) {
    try {
      const upgradePlanDto: UpgradePlanDto = {
        plan: upgradeUserPlanDto.plan,
        userId,
      };
      const user = await lastValueFrom(
        this.userClient.send<UserModel>('upgradeUserPlan', upgradePlanDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
