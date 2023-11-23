import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { ProfileModel } from '../../../../libs/shared/src/model/profile.model';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { WalletModel } from '@app/shared/model/wallet.model';
import { UpgradePlanDto } from '@app/shared/dto/user-service/upgrade-plan.dto';
import { UserModel } from '@app/shared/model/user.model';
import { QueryUserDto } from '@app/shared/dto/user-service/query-user.dto';
import { CategoryModel } from '@app/shared/model/category.model';
import {
  FetchFollowsDto,
  FollowUserDto,
  HandleFollowDto,
} from '@app/shared/dto/user-service/follow-user.dto';
import { FollowModel } from '@app/shared/model/follow.model';
import { ReportUserDto } from '@app/shared/dto/user-service/report-user.dto';
import { ReportModel } from '@app/shared/model/report.model';
import {
  BlockUserDto,
  UnBlockUserDto,
} from '@app/shared/dto/user-service/block-user.dto';
import { BlockModel } from '@app/shared/model/block.model';
import { IdeaModel } from '@app/shared/model/idea.model';
import { LikeModel } from '@app/shared/model/like.model';
import { ShareModel } from '@app/shared/model/share.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(RABBITMQ_QUEUES.USER_SERVICE)
    private readonly userClient: ClientProxy,
    @Inject(RABBITMQ_QUEUES.WALLET_SERVICE)
    private readonly walletClient: ClientProxy,
    @Inject(RABBITMQ_QUEUES.IDEA_SERVICE)
    private readonly ideaClient: ClientProxy,
  ) {}
  async updateUserProfile(userId: string, updateProfileDto: UpdateProfileDto) {
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

  async updateUserBackgroundPicture(userId: string, file: Express.Multer.File) {
    const user = await lastValueFrom(
      this.userClient.send<ProfileModel>('updateBackgroundPicture', {
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

  async findOne(userId: string) {
    const response = await lastValueFrom(
      this.userClient.send<UserModel>('findOneUser', userId),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return response;
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
        this.userClient.send<UserModel>('getUserDetails', id),
      );
      return user;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  async fetchUserIdeaDetails(userId: string) {
    const userIdeaDetails = await lastValueFrom(
      this.ideaClient.send<{
        ideas: IdeaModel[];
        likes: LikeModel[];
        shares: ShareModel[];
        sharedIdeas: IdeaModel[];
        likedIdeas: IdeaModel[];
      }>('fetchUserIdeaDetails', userId),
    ).catch((err) => {
      throw new RpcException(err.response);
    });

    for (const idea of userIdeaDetails.ideas) {
      const user = await this.getUserDetails(idea.userId);
      idea['user'] = user;
    }
    for (const idea of userIdeaDetails.sharedIdeas) {
      const user = await this.getUserDetails(idea.userId);
      idea['user'] = user;
    }
    for (const idea of userIdeaDetails.likedIdeas) {
      const user = await this.getUserDetails(idea.userId);
      idea['user'] = user;
    }
    return userIdeaDetails;
  }

  async getUserInterests(id: string) {
    const interests = await lastValueFrom(
      this.userClient.send<CategoryModel[]>('getUserInterest', id),
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
    const upgradePlanDto: UpgradePlanDto = {
      plan: upgradeUserPlanDto.plan,
      userId,
    };
    const user = await lastValueFrom(
      this.userClient.send<UserModel>('upgradeUserPlan', upgradePlanDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return user;
  }

  async followUser(followUserDto: FollowUserDto) {
    const follow = await lastValueFrom(
      this.userClient.send<{ follow: UserModel; follower: UserModel }>(
        'followUser',
        followUserDto,
      ),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return follow;
  }

  async unFollowUser(followUserDto: FollowUserDto) {
    const follow = await lastValueFrom(
      this.userClient.send<boolean>('unFollowUser', followUserDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return follow;
  }

  async checkIfFollowing(followUserDto: FollowUserDto) {
    const isFollowing = await lastValueFrom(
      this.userClient.send<boolean>('checkIfFollowing', followUserDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return isFollowing;
  }

  async handleFollow(handleFollowDto: HandleFollowDto) {
    const follow = await lastValueFrom(
      this.userClient.send<FollowModel>('handleFollow', handleFollowDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return follow;
  }

  async fetchFollows(fetchFollowsDto: FetchFollowsDto) {
    const follow = await lastValueFrom(
      this.userClient.send<{
        followers: FollowModel[];
        following: FollowModel[];
      }>('fetchUserFollows', fetchFollowsDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return follow;
  }

  async reportUser(reportUserDto: ReportUserDto) {
    const report = await lastValueFrom(
      this.userClient.send<ReportModel>('reportUser', reportUserDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return report;
  }

  async blockUser(blockUserDto: BlockUserDto) {
    const block = await lastValueFrom(
      this.userClient.send<BlockModel>('blockUser', blockUserDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return block;
  }

  async unBlockUser(unBlockUserDto: UnBlockUserDto) {
    const success = await lastValueFrom(
      this.userClient.send<boolean>('unBlockUser', unBlockUserDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return success;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
