import { Inject, Injectable } from '@nestjs/common';
import {
  CreateIdeaForSaleDto,
  CreateIdeaFundingNeededDto,
  CreateIdeaNewConceptDto,
  CreateIdeaSimpleDto,
} from '@app/shared/dto/idea/create-idea.dto';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { UserService } from '../user/user.service';
import { IdeaModel } from '@app/shared/model/idea.model';
import { QueryIdeaSimpleDto } from '@app/shared/dto/idea/query-idea-simple.dto';

@Injectable()
export class IdeaService {
  constructor(
    @Inject(RABBITMQ_QUEUES.IDEA_SERVICE) private ideaClient: ClientProxy,
    private userService: UserService,
  ) {}
  async createIdeaSimple(createIdeaSimpleDto: CreateIdeaSimpleDto) {
    const idea = await lastValueFrom(
      this.ideaClient.send<IdeaModel>('createIdeaSimple', createIdeaSimpleDto),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    const user = await this.userService.getUserDetails(idea.userId);
    idea['user'] = user;
    return idea;
  }

  async createIdeaFundingNeeded(
    createIdeaFundingNeededDto: CreateIdeaFundingNeededDto,
  ) {
    const idea = await lastValueFrom(
      this.ideaClient.send(
        'createIdeaFundingNeeded',
        createIdeaFundingNeededDto,
      ),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    const user = await this.userService.getUserDetails(idea.userId);
    idea['user'] = user;
    return idea;
  }

  async createIdeaForSale(createIdeaForSaleDto: CreateIdeaForSaleDto) {
    const idea = await lastValueFrom(
      this.ideaClient.send('createIdeaForSale', createIdeaForSaleDto),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    const user = await this.userService.getUserDetails(idea.userId);
    idea['user'] = user;
    return idea;
  }

  async createIdeaNewConcept(createIdeaNewConceptDto: CreateIdeaNewConceptDto) {
    const idea = await lastValueFrom(
      this.ideaClient.send('createIdeaNewConcept', createIdeaNewConceptDto),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    const user = await this.userService.getUserDetails(idea.userId);
    idea['user'] = user;
    return idea;
  }

  async querySimpleIdea(queryIdeaSimpleDto: QueryIdeaSimpleDto) {
    const ideas = await lastValueFrom(
      this.ideaClient.send<IdeaModel[]>('querySimpleIdea', queryIdeaSimpleDto),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    for (const idea of ideas) {
      const user = await this.userService.getUserDetails(idea.userId);
      idea['user'] = user;
    }
    return ideas;
  }

  findOne(id: number) {
    return `This action returns a #${id} idea`;
  }

  // update(id: number, updateIdeaDto: UpdateIdeaDto) {
  //   return `This action updates a #${id} idea`;
  // }

  remove(id: number) {
    return `This action removes a #${id} idea`;
  }
}
