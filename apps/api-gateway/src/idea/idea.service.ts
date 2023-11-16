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
import { LikeIdeaDto } from '@app/shared/dto/idea/like-idea.dto';
import { LikeModel } from '@app/shared/model/like.model';
import { ShareIdeaDto } from '@app/shared/dto/idea/share-idea.dto';
import { ShareModel } from '@app/shared/model/share.model';
import { CreateCommentDto } from '@app/shared/dto/idea/create-comment.dto';
import { GetCommentsDto } from '@app/shared/dto/idea/get-comments.dto';
import { CommentModel } from '@app/shared/model/comment.model';

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
  async like(ideaId: string, likeIdeaDto: Omit<LikeIdeaDto, 'ideaId'>) {
    const like = await lastValueFrom(
      this.ideaClient.send<LikeModel>('like', { ...likeIdeaDto, ideaId }),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return like;
  }

  async unLike(likeId: string) {
    const like = await lastValueFrom(
      this.ideaClient.send<boolean>('unLike', likeId),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return like;
  }

  async share(ideaId: string, shareIdeaDto: Omit<ShareIdeaDto, 'ideaId'>) {
    const share = await lastValueFrom(
      this.ideaClient.send<ShareModel>('share', { ...shareIdeaDto, ideaId }),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return share;
  }

  async unShare(shareId: string) {
    const share = await lastValueFrom(
      this.ideaClient.send<boolean>('unShare', shareId),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return share;
  }

  async comment(
    ideaId: string,
    createCommentDto: Omit<CreateCommentDto, 'ideaId'>,
  ) {
    const comment = await lastValueFrom(
      this.ideaClient.send<CommentModel>('comment', {
        ...createCommentDto,
        ideaId,
      }),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return comment;
  }

  async getComments(getCommentsDto: GetCommentsDto) {
    const comments = await lastValueFrom(
      this.ideaClient.send<CommentModel[]>('fetchComments', getCommentsDto),
    ).catch((err) => {
      throw new RpcException(err.response);
    });
    return comments;
  }

  remove(id: number) {
    return `This action removes a #${id} idea`;
  }
}
