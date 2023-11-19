import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import { UpdateIdeaDto } from './dto/update-idea.dto';
import {
  CreateIdeaForSaleDto,
  CreateIdeaFundingNeededDto,
  CreateIdeaNewConceptDto,
  CreateIdeaSimpleDto,
} from '@app/shared/dto/idea/create-idea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import {
  Equal,
  ILike,
  In,
  IsNull,
  Like,
  Not,
  Repository,
  TreeRepository,
} from 'typeorm';
import { IdeaNeedEnum, IdeaTypeEnum, LIkeTypeEnum } from '../utils/constants';
import { FileTypeEnum, RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';
import { FileModel } from '@app/shared/model/file.model';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { QueryIdeaSimpleDto } from '@app/shared/dto/idea/query-idea-simple.dto';
import { LikeIdeaDto } from '@app/shared/dto/idea/like-idea.dto';
import { Like as RepositoryLike } from './entities/like.entity';
import { Share } from './entities/share.entity';
import { ShareIdeaDto } from '@app/shared/dto/idea/share-idea.dto';
import { CreateCommentDto } from '@app/shared/dto/idea/create-comment.dto';
import { Comment } from './entities/comment.entity';
import { GetCommentsDto } from '@app/shared/dto/idea/get-comments.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    @InjectRepository(RepositoryLike)
    private likeRepository: Repository<RepositoryLike>,
    @InjectRepository(Share)
    private shareRepository: Repository<Share>,
    @InjectRepository(Comment)
    private commentRepository: TreeRepository<Comment>,
    private categoryService: CategoryService,
    @Inject(RABBITMQ_QUEUES.FILE_SERVICE) private fileClient: ClientProxy,
  ) {}

  async checkIfExistingIdea(userId: string, title: string) {
    const existingIdea = await this.ideaRepository.findOneBy({
      title: title,
      userId: userId,
    });
    if (existingIdea) {
      throw new RpcException(
        new BadRequestException('Idea Title Alredy used by User'),
      );
    }
  }

  async createIdeaSimple(createIdeaSimpleDto: CreateIdeaSimpleDto) {
    const categories: Category[] = [];
    await this.checkIfExistingIdea(
      createIdeaSimpleDto.userId,
      createIdeaSimpleDto.title,
    );
    for (const category of createIdeaSimpleDto.categories) {
      const c = await this.categoryService.findOneByName(category);
      categories.push(c);
    }
    const idea = await this.ideaRepository.save({
      ...createIdeaSimpleDto,
      accepted: true,
      media: [],
      categories: categories,
    });

    const ideaFiles: FileModel[] = [];
    for (let i = 0; i < createIdeaSimpleDto.media.length; i++) {
      const fileName = idea.id + '_' + `file_${i}`;
      const fileDetails: SaveFileDto = {
        author: createIdeaSimpleDto.userId,
        name: fileName,
        file: createIdeaSimpleDto.media[i],
        mimetype: createIdeaSimpleDto.media[i].mimetype,
        parent: idea.id,
        type: FileTypeEnum.IDEA,
      };
      const savedFile = await lastValueFrom(
        this.fileClient.send<FileModel>('saveFile', fileDetails),
      );
      ideaFiles.push(savedFile);
    }
    idea.media = ideaFiles;
    await this.ideaRepository.save(idea);
    return idea;
  }

  async createIdeaFundingNeeded(
    createIdeaFundingNeededDto: CreateIdeaFundingNeededDto,
  ) {
    // const idea = await this.ideaRepository.create(createIdeaFundingNeededDto);
    // idea.ideaType = IdeaTypeEnum.VAULT;
    // idea.ideaNeed = IdeaNeedEnum.FUNDING;
    // await idea.save();
    // return idea;
  }

  async createIdeaForSale(createIdeaForSaleDto: CreateIdeaForSaleDto) {
    // const idea = await this.ideaRepository.create(createIdeaForSaleDto);
    // idea.ideaType = IdeaTypeEnum.VAULT;
    // idea.ideaNeed = IdeaNeedEnum.SALE;
    // await idea.save();
    // return idea;
  }

  async createIdeaNewConcept(createIdeaNewConceptDto: CreateIdeaNewConceptDto) {
    // const idea = await this.ideaRepository.create(createIdeaNewConceptDto);
    // idea.ideaType = IdeaTypeEnum.VAULT;
    // idea.ideaNeed = IdeaNeedEnum.SALE;
    // await idea.save();
    // return idea;
  }

  async findAll() {
    const ideas = await this.ideaRepository.find();
    return ideas;
  }

  async findAllSimpleIdeas() {
    const ideas = await this.ideaRepository.find({
      where: {
        ideaType: IdeaTypeEnum.FREE,
      },
    });
    return ideas;
  }

  async querySimpleIdea(query: QueryIdeaSimpleDto) {
    const ideas = await this.ideaRepository.find({
      relations: {
        categories: true,
        likes: true,
        shares: true,
        comments: true,
      },
      where: [
        {
          title: ILike(`%${query.title || ''}%`),
          ideaType: IdeaTypeEnum.FREE,
          userId: query.user,
          spotlight: query.spotlight,
          categories: {
            name: query.category,
          },
        },
      ],
    });
    return ideas;
  }

  async findOne(id: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: {
        likes: true,
        shares: true,
        comments: true,
      },
    });
    if (!idea) {
      throw new NotFoundException('No idea found for this title');
    }
    return idea;
  }

  async findOneByTitle(title: string) {
    const idea = await this.ideaRepository.findOne({
      where: { title },
    });
    if (!idea) {
      throw new NotFoundException('No idea found for this title');
    }
    return idea;
  }

  //IDEA ACTIONS
  //Share
  async shareIdea(shareIdeaDto: ShareIdeaDto) {
    if (shareIdeaDto.type === LIkeTypeEnum.IDEA) {
      const existingShare = await this.shareRepository.findOneBy({
        idea: {
          id: shareIdeaDto.ideaId,
        },
        userId: shareIdeaDto.userId,
      });
      if (existingShare) {
        return;
      }
      const idea = await this.findOne(shareIdeaDto.ideaId);
      const share = this.shareRepository.save({
        idea: idea,
        userId: shareIdeaDto.userId,
        type: shareIdeaDto.type,
      });
      return share;
    } else {
      const existingShare = await this.shareRepository.findOneBy({
        comment: {
          id: shareIdeaDto.commentId,
        },
        userId: shareIdeaDto.userId,
      });
      if (existingShare) {
        return;
      }
      const comment = await this.findOneComment(shareIdeaDto.commentId);
      const share = this.shareRepository.save({
        comment: comment,
        userId: shareIdeaDto.userId,
        type: shareIdeaDto.type,
      });
      return share;
    }
  }

  async unShareIdea(shareId: string) {
    const deleteResponse = await this.shareRepository.delete(shareId);
    if (!deleteResponse.affected) {
      throw new RpcException(new NotFoundException('Share Not Found'));
    }
    return true;
  }

  //Like
  async like(likeIdeaDto: LikeIdeaDto) {
    if (likeIdeaDto.type === LIkeTypeEnum.IDEA) {
      const existingLike = await this.likeRepository.findOneBy({
        idea: {
          id: likeIdeaDto.ideaId,
        },
        userId: likeIdeaDto.userId,
      });
      if (existingLike) {
        return;
      }
      const idea = await this.findOne(likeIdeaDto.ideaId);
      const like = this.likeRepository.save({
        idea: idea,
        userId: likeIdeaDto.userId,
        type: likeIdeaDto.type,
      });
      return like;
    } else {
      const existingLike = await this.likeRepository.findOneBy({
        comment: {
          id: likeIdeaDto.ideaId,
        },
        userId: likeIdeaDto.userId,
      });
      if (existingLike) {
        return;
      }
      const comment = await this.findOneComment(likeIdeaDto.commentId);
      const like = this.likeRepository.save({
        comment: comment,
        userId: likeIdeaDto.userId,
        type: likeIdeaDto.type,
      });
      return like;
    }
  }

  async unLikeIdea(likeId: string) {
    try {
      const deleteResponse = await this.likeRepository.delete(likeId);
      if (!deleteResponse.affected) {
        throw new RpcException(new NotFoundException('Like Not Found'));
      }
      return true;
    } catch (error) {
      console.log(error);
    }
  }

  //Comment
  async comment(createCommentDto: CreateCommentDto) {
    const idea = await this.findOne(createCommentDto.ideaId);
    if (createCommentDto.type === LIkeTypeEnum.IDEA) {
      const comment = await this.commentRepository.save({
        idea: idea,
        comment: createCommentDto.comment,
        type: createCommentDto.type,
        userId: createCommentDto.userId,
      });
      return comment;
    } else {
      const parentComment = await this.findOneComment(
        createCommentDto.commentId,
      );
      const comment = await this.commentRepository.save({
        idea: idea,
        parent: parentComment,
        comment: createCommentDto.comment,
        type: createCommentDto.type,
        userId: createCommentDto.userId,
      });
      return comment;
    }
  }

  async findOneComment(id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id },
    });
    if (!comment) {
      throw new NotFoundException('No Comment found for this title');
    }
    return comment;
  }
  async findComments(getCommentsDto: GetCommentsDto) {
    if (getCommentsDto.type == LIkeTypeEnum.IDEA) {
      const comments = await this.commentRepository.find({
        where: {
          idea: {
            id: getCommentsDto.id,
          },
        },
        relations: {
          likes: true,
          shares: true,
          children: true,
          parent: true,
        },
        order: {
          createdAt: 'DESC',
        },
      });
      return comments;
    } else {
      const comment = await this.findOneComment(getCommentsDto.id);
      const comments = await this.commentRepository.findDescendants(comment, {
        relations: ['likes', 'shares', 'children'],
      });
      return comments;
    }
  }

  // update(id: number, updateIdeaDto: UpdateIdeaDto) {
  //   return `This action updates a #${id} idea`;
  // }

  remove(id: number) {
    return `This action removes a #${id} idea`;
  }
}
