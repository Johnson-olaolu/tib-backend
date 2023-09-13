import { Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { lastValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ_QUEUES } from '../utils/constants';
import { ProfileModel } from './model/profile.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(RABBITMQ_QUEUES.USER_SERVICE)
    private readonly userClient: ClientProxy,
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

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: string) {
    return `This action returns a #${id} user`;
  }

  async getUserDetails(id: string) {
    const user = await lastValueFrom(
      this.userClient.send('getUserDetails', id),
    );
    return user;
  }

  update(userId: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${userId} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
