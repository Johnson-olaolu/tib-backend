import { Inject, Injectable } from '@nestjs/common';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { CreateInterestDto } from '@app/shared/dto/user-service/create-interest.dto';
import { lastValueFrom } from 'rxjs';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { InterestModel } from '@app/shared/model/interest.model';

@Injectable()
export class InterestService {
  constructor(
    @Inject(RABBITMQ_QUEUES.USER_SERVICE) private userClient: ClientProxy,
  ) {}
  async create(createInterestDto: CreateInterestDto) {
    const interest = await lastValueFrom(
      this.userClient.send<InterestModel>('createInterest', createInterestDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return interest;
  }

  async findAll() {
    const interests = await lastValueFrom(
      this.userClient.send<InterestModel[]>('findAllInterest', {}),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return interests;
  }

  async findOne(id: string) {
    const interest = await lastValueFrom(
      this.userClient.send<InterestModel>('findOneInterest', id),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return interest;
  }

  async query(name: string) {
    const interests = await lastValueFrom(
      this.userClient.send<InterestModel[]>('queryInterest', name),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return interests;
  }

  async update(id: string, updateInterestDto: Omit<UpdateInterestDto, 'id'>) {
    const interest = await lastValueFrom(
      this.userClient.send<InterestModel>('updateInterest', {
        id,
        ...updateInterestDto,
      }),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return interest;
  }

  async remove(id: string) {
    const interest = await lastValueFrom(
      this.userClient.send<InterestModel>('deleteInterest', id),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return interest;
  }
}
