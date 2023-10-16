import { CreateIdeaConstantDto } from '@app/shared/dto/idea/create-idea-constant.dto';
import { UpdateIdeaConstantDto } from '@app/shared/dto/idea/update-idea-constant.dto';
import { IdeaConstantModel } from '@app/shared/model/idea-constant.model';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IdeaConstantsService {
  constructor(
    @Inject(RABBITMQ_QUEUES.IDEA_SERVICE) private ideaClient: ClientProxy,
  ) {}
  async create(createIdeaConstantDto: CreateIdeaConstantDto) {
    const ideaConstant = await lastValueFrom(
      this.ideaClient.send<IdeaConstantModel>(
        'createIdeaConstant',
        createIdeaConstantDto,
      ),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return ideaConstant;
  }

  async findAll() {
    const ideaConstant = await lastValueFrom(
      this.ideaClient.send<IdeaConstantModel[]>('findAllIdeaConstants', ''),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return ideaConstant;
  }

  async findOne(id: string) {
    const ideaConstant = await lastValueFrom(
      this.ideaClient.send<IdeaConstantModel[]>('findOneIdeaConstant', id),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return ideaConstant;
  }

  async findOneByName(name: string) {
    const ideaConstant = await lastValueFrom(
      this.ideaClient.send<IdeaConstantModel[]>(
        'findOneIdeaConstantByName',
        name,
      ),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return ideaConstant;
  }

  async update(updateIdeaConstantDto: UpdateIdeaConstantDto) {
    const ideaConstant = await lastValueFrom(
      this.ideaClient.send<IdeaConstantModel>(
        'updateIdeaConstantByName',
        updateIdeaConstantDto,
      ),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return ideaConstant;
  }

  async remove(id: string) {
    await lastValueFrom(
      this.ideaClient.send<IdeaConstantModel>('deleteIdeaConstantByName', id),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return true;
  }
}
