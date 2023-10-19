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

@Injectable()
export class IdeaService {
  constructor(
    @Inject(RABBITMQ_QUEUES.IDEA_SERVICE) private ideaClient: ClientProxy,
  ) {}
  async createIdeaSimple(createIdeaSimpleDto: CreateIdeaSimpleDto) {
    const idea = await lastValueFrom(
      this.ideaClient.send('createIdeaSimple', createIdeaSimpleDto),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
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
    return idea;
  }

  async createIdeaForSale(createIdeaForSaleDto: CreateIdeaForSaleDto) {
    const idea = await lastValueFrom(
      this.ideaClient.send('createIdeaForSale', createIdeaForSaleDto),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return idea;
  }

  async createIdeaNewConcept(createIdeaNewConceptDto: CreateIdeaNewConceptDto) {
    const idea = await lastValueFrom(
      this.ideaClient.send('createIdeaNewConcept', createIdeaNewConceptDto),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return idea;
  }

  findAll() {
    return `This action returns all idea`;
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
