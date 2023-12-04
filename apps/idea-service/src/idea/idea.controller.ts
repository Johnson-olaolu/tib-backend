import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdeaService } from './idea.service';
import {
  CreateIdeaForSaleDto,
  CreateIdeaFundingNeededDto,
  CreateIdeaNewConceptDto,
  CreateIdeaSimpleDto,
} from '@app/shared/dto/idea/create-idea.dto';
import { QueryIdeaSimpleDto } from '@app/shared/dto/idea/query-idea-simple.dto';
import { LikeIdeaDto } from '@app/shared/dto/idea/like-idea.dto';
import { ShareIdeaDto } from '@app/shared/dto/idea/share-idea.dto';
import { CreateCommentDto } from '@app/shared/dto/idea/create-comment.dto';
import { GetCommentsDto } from '@app/shared/dto/idea/get-comments.dto';

@Controller()
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @MessagePattern('createIdeaSimple')
  createIdeaSimple(@Payload() createIdeaSimpleDto: CreateIdeaSimpleDto) {
    return this.ideaService.createIdeaSimple(createIdeaSimpleDto);
  }

  @MessagePattern('createIdeaFundingNeeded')
  createIdeaFundingNeeded(
    @Payload() createIdeaFundingNeededDto: CreateIdeaFundingNeededDto,
  ) {
    return this.ideaService.createIdeaFundingNeeded(createIdeaFundingNeededDto);
  }

  @MessagePattern('createIdeaForSale')
  createIdeaForSale(@Payload() createIdeaForSaleDto: CreateIdeaForSaleDto) {
    return this.ideaService.createIdeaForSale(createIdeaForSaleDto);
  }

  @MessagePattern('createIdeaNewConcept')
  createIdeaNewConcept(
    @Payload() createIdeaNewConceptDto: CreateIdeaNewConceptDto,
  ) {
    return this.ideaService.createIdeaNewConcept(createIdeaNewConceptDto);
  }

  @MessagePattern('findAllIdea')
  findAll() {
    return this.ideaService.findAll();
  }

  @MessagePattern('querySimpleIdea')
  querySimpleIdea(@Payload() queryIdeaSimpleDto: QueryIdeaSimpleDto) {
    return this.ideaService.querySimpleIdea(queryIdeaSimpleDto);
  }

  @MessagePattern('findOneIdea')
  findOne(@Payload() id: string) {
    return this.ideaService.findOne(id);
  }

  @MessagePattern('findOneIdeaByTitle')
  findOneByTitle(@Payload() title: string) {
    return this.ideaService.findOneByTitle(title);
  }

  // @MessagePattern('updateIdea')
  // update(@Payload() updateIdeaDto: UpdateIdeaDto) {
  //   return this.ideaService.update(updateIdeaDto.id, updateIdeaDto);
  // }

  @MessagePattern('like')
  async like(@Payload() likeIdeaDto: LikeIdeaDto) {
    return this.ideaService.like(likeIdeaDto);
  }

  @MessagePattern('unLike')
  async unlike(@Payload() likeId: string) {
    return this.ideaService.unLikeIdea(likeId);
  }

  @MessagePattern('share')
  async share(@Payload() shareIdeaDto: ShareIdeaDto) {
    return this.ideaService.shareIdea(shareIdeaDto);
  }

  @MessagePattern('unShare')
  async unShare(@Payload() shareId: string) {
    return this.ideaService.unShareIdea(shareId);
  }

  @MessagePattern('comment')
  async comment(@Payload() createCommentDto: CreateCommentDto) {
    return this.ideaService.comment(createCommentDto);
  }

  @MessagePattern('fetchComments')
  async fetchComments(@Payload() getCommentsDto: GetCommentsDto) {
    return this.ideaService.findComments(getCommentsDto);
  }

  @MessagePattern('fetchUserIdeaDetails')
  async fetchUserIdeaDetails(@Payload() userId: string) {
    return this.ideaService.fetchUserIdeaDetails(userId);
  }

  @MessagePattern('fetchCategoryIdeaDetails')
  async fetchCategoryIdeaDetails(@Payload() categoryId: string) {
    return this.ideaService.fetchCategoryIdeaDetails(categoryId);
  }

  @MessagePattern('removeIdea')
  remove(@Payload() id: number) {
    return this.ideaService.remove(id);
  }
}
