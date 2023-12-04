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
import { QueryIdeaVaultDto } from '@app/shared/dto/idea/query-idea-vault.dto';

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
    await this.checkIfExistingIdea(
      createIdeaFundingNeededDto.userId,
      createIdeaFundingNeededDto.title,
    );
    const categories: Category[] = [];
    for (const category of createIdeaFundingNeededDto.categories) {
      const c = await this.categoryService.findOneByName(category);
      categories.push(c);
    }

    const idea = await this.ideaRepository.save({
      ...createIdeaFundingNeededDto,
      accepted: true,
      media: [],
      additionalAttachment: [],
      categories: categories,
      ideaNeed: IdeaNeedEnum.FUNDING,
      ideaType: IdeaTypeEnum.VAULT,
    });

    const ideaFiles: FileModel[] = [];
    for (let i = 0; i < createIdeaFundingNeededDto.media?.length || 0; i++) {
      const fileName = idea.id + '_' + `file_${i}`;
      const fileDetails: SaveFileDto = {
        author: createIdeaFundingNeededDto.userId,
        name: fileName,
        file: createIdeaFundingNeededDto.media[i],
        mimetype: createIdeaFundingNeededDto.media[i].mimetype,
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

  async createIdeaForSale(createIdeaForSaleDto: CreateIdeaForSaleDto) {
    await this.checkIfExistingIdea(
      createIdeaForSaleDto.userId,
      createIdeaForSaleDto.title,
    );
    const categories: Category[] = [];
    for (const category of createIdeaForSaleDto.categories) {
      const c = await this.categoryService.findOneByName(category);
      categories.push(c);
    }

    const idea = await this.ideaRepository.save({
      ...createIdeaForSaleDto,
      accepted: true,
      media: [],
      additionalAttachment: [],
      categories: categories,
      ideaNeed: IdeaNeedEnum.SALE,
      ideaType: IdeaTypeEnum.VAULT,
    });

    const ideaFiles: FileModel[] = [];
    for (let i = 0; i < createIdeaForSaleDto.media?.length || 0; i++) {
      const fileName = idea.id + '_' + `file_${i}`;
      const fileDetails: SaveFileDto = {
        author: createIdeaForSaleDto.userId,
        name: fileName,
        file: createIdeaForSaleDto.media[i],
        mimetype: createIdeaForSaleDto.media[i].mimetype,
        parent: idea.id,
        type: FileTypeEnum.IDEA,
      };
      const savedFile = await lastValueFrom(
        this.fileClient.send<FileModel>('saveFile', fileDetails),
      );
      ideaFiles.push(savedFile);
    }
    idea.media = ideaFiles;

    const ideaAttachMents: FileModel[] = [];
    for (
      let i = 0;
      i < createIdeaForSaleDto.additionalAttachment?.length || 0;
      i++
    ) {
      const fileName = idea.id + '_' + `file_${i}`;
      const fileDetails: SaveFileDto = {
        author: createIdeaForSaleDto.userId,
        name: fileName,
        file: createIdeaForSaleDto.additionalAttachment[i],
        mimetype: createIdeaForSaleDto.additionalAttachment[i].mimetype,
        parent: idea.id,
        type: FileTypeEnum.IDEA,
      };
      const savedFile = await lastValueFrom(
        this.fileClient.send<FileModel>('saveFile', fileDetails),
      );
      ideaAttachMents.push(savedFile);
    }
    idea.additionalAttachment = ideaAttachMents;

    await this.ideaRepository.save(idea);
    return idea;
  }

  async createIdeaNewConcept(createIdeaNewConceptDto: CreateIdeaNewConceptDto) {
    await this.checkIfExistingIdea(
      createIdeaNewConceptDto.userId,
      createIdeaNewConceptDto.title,
    );
    const categories: Category[] = [];
    for (const category of createIdeaNewConceptDto.categories) {
      const c = await this.categoryService.findOneByName(category);
      categories.push(c);
    }

    const idea = await this.ideaRepository.save({
      ...createIdeaNewConceptDto,
      accepted: true,
      media: [],
      categories: categories,
      ideaNeed: IdeaNeedEnum.NEW_CONCEPT,
      ideaType: IdeaTypeEnum.VAULT,
    });

    const ideaFiles: FileModel[] = [];
    for (let i = 0; i < createIdeaNewConceptDto.media?.length || 0; i++) {
      const fileName = idea.id + '_' + `file_${i}`;
      const fileDetails: SaveFileDto = {
        author: createIdeaNewConceptDto.userId,
        name: fileName,
        file: createIdeaNewConceptDto.media[i],
        mimetype: createIdeaNewConceptDto.media[i].mimetype,
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
  async queryVaultIdea(query: QueryIdeaVaultDto) {
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
          ideaType: IdeaTypeEnum.VAULT,
          ideaNeed: query.ideaNeed,
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

  async updateIdeaSimple(id: string, createIdeaSimpleDto: CreateIdeaSimpleDto) {
    const idea = await this.findOne(id);
    for (const detail in createIdeaSimpleDto) {
      if (detail !== 'media') {
        idea[detail] = createIdeaSimpleDto[detail];
      } else {
      }
    }
    await idea.save();
  }
  async updateIdeaFundingNeeded(
    id: string,
    createIdeaFundingNeededDto: CreateIdeaFundingNeededDto,
  ) {
    const idea = await this.findOne(id);
    for (const detail in createIdeaFundingNeededDto) {
      if (detail !== 'media') {
        idea[detail] = createIdeaFundingNeededDto[detail];
      } else {
      }
    }
    await idea.save();
  }

  async updateIdeaForSale(
    id: string,
    createIdeaForSaleDto: CreateIdeaForSaleDto,
  ) {
    const idea = await this.findOne(id);
    for (const detail in createIdeaForSaleDto) {
      if (detail !== 'media' && detail !== 'additionalAttachment') {
        idea[detail] = createIdeaForSaleDto[detail];
      } else {
      }
    }
    await idea.save();
  }

  async updateIdeaNewConcept(
    id: string,
    createIdeaForSaleDto: CreateIdeaForSaleDto,
  ) {
    const idea = await this.findOne(id);
    for (const detail in createIdeaForSaleDto) {
      if (detail !== 'media' && detail !== 'additionalAttachment') {
        idea[detail] = createIdeaForSaleDto[detail];
      } else {
      }
    }
    await idea.save();
  }

  //Custom
  async fetchUserIdeaDetails(userId: string) {
    const ideas = await this.ideaRepository.find({
      where: [{ userId }, { shares: { userId } }],
      relations: {
        categories: true,
        likes: true,
        shares: true,
        comments: true,
      },
    });
    const sharedIdeas = await this.ideaRepository.find({
      where: { shares: { userId } },
      relations: {
        categories: true,
        likes: true,
        shares: true,
        comments: true,
      },
    });
    const likedIdeas = await this.ideaRepository.find({
      where: { likes: { userId } },
      relations: {
        categories: true,
        likes: true,
        shares: true,
        comments: true,
      },
    });
    const shares = await this.shareRepository.find({
      where: {
        idea: {
          userId,
        },
      },
    });
    const likes = await this.likeRepository.find({
      where: {
        idea: {
          userId,
        },
      },
    });

    return {
      ideas,
      shares,
      likes,
      sharedIdeas,
      likedIdeas,
    };
  }

  async fetchCategoryIdeaDetails(categoryId: string) {
    const likes = await this.likeRepository.find({
      where: {
        idea: {
          categories: {
            id: categoryId,
          },
        },
      },
    });
    const shares = await this.shareRepository.find({
      where: {
        idea: {
          categories: {
            id: categoryId,
          },
        },
      },
    });
    const sharedIdeas = await this.ideaRepository
      .createQueryBuilder('idea')
      .innerJoinAndSelect('idea.shares', 'share')
      .innerJoin('idea.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .groupBy('idea.id, share.id')
      .having('COUNT(share.id) > 1')
      .getMany();

    const likedIdeas = await this.ideaRepository
      .createQueryBuilder('idea')
      .innerJoinAndSelect('idea.likes', 'like')
      .innerJoin('idea.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .groupBy('idea.id, like.id')
      .having('COUNT(like.id) > 1')
      .getMany();

    // const mostViewed = await this.ideaRepository
    //   .createQueryBuilder('idea')
    //   .innerJoin('idea.categories', 'category')
    //   .leftJoin('idea.views', 'view')
    //   .where('category.id = :categoryId', { categoryId })
    //   .groupBy('idea.id, view.id')
    //   .orderBy('COUNT(view.id)', 'DESC')
    //   .take(10)
    //   .getMany();

    const mostViewed = [];

    // const mostViewed = await this.ideaRepository.find({
    //   take: 10,
    //   where: {
    //     categories: {
    //       id: categoryId,
    //     },
    //   },
    //   order: {
    //     view: 'DESC',
    //   },
    // });

    return { likedIdeas, likes, sharedIdeas, shares, mostViewed };
  }

  remove(id: number) {
    return `This action removes a #${id} idea`;
  }
}
