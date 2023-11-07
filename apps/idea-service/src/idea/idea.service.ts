import { Inject, Injectable, NotFoundException } from '@nestjs/common';
// import { UpdateIdeaDto } from './dto/update-idea.dto';
import {
  CreateIdeaForSaleDto,
  CreateIdeaFundingNeededDto,
  CreateIdeaNewConceptDto,
  CreateIdeaSimpleDto,
} from '@app/shared/dto/idea/create-idea.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { Equal, ILike, In, Like, Repository } from 'typeorm';
import { IdeaNeedEnum, IdeaTypeEnum } from '../utils/constants';
import { FileTypeEnum, RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';
import { FileModel } from '@app/shared/model/file.model';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { QueryIdeaSimpleDto } from '@app/shared/dto/idea/query-idea-simple.dto';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    private categoryService: CategoryService,
    @Inject(RABBITMQ_QUEUES.FILE_SERVICE) private fileClient: ClientProxy,
  ) {}

  async createIdeaSimple(createIdeaSimpleDto: CreateIdeaSimpleDto) {
    const categories: Category[] = [];
    for (const category of createIdeaSimpleDto.categories) {
      const c = await this.categoryService.findOneByName(category);
      categories.push(c);
    }
    console.log({
      ...createIdeaSimpleDto,
      accepted: true,
      media: [],
      categories: categories,
    });
    const idea = await this.ideaRepository.save({
      ...createIdeaSimpleDto,
      accepted: true,
      media: [],
      categories: categories,
    });

    const ideaFiles: string[] = [];
    for (let i = 0; i < createIdeaSimpleDto.media.length; i++) {
      const fileName = idea.id + '_' + `file_${i}`;
      const fileDetails: SaveFileDto = {
        author: createIdeaSimpleDto.userId,
        name: fileName,
        file: createIdeaSimpleDto.media[i],
        mimetype: createIdeaSimpleDto.media[i].mimetype,
        parent: idea.id,
        type: FileTypeEnum.APP,
      };
      const savedFile = await lastValueFrom(
        this.fileClient.send<FileModel>('saveFile', fileDetails),
      );
      ideaFiles.push(savedFile.path);
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
      relations: ['categories'],
      where: [
        {
          title: ILike(`%${query.title}%`),
          ideaType: IdeaTypeEnum.FREE,
        },
        {
          userId: Equal(query.user),
          ideaType: IdeaTypeEnum.FREE,
        },
        {
          spotlight: Equal(query.spotlight),
          ideaType: IdeaTypeEnum.FREE,
        },
        {
          categories: {
            name: Like(query.category),
          },
          ideaType: IdeaTypeEnum.FREE,
        },
        // {
        //   categories: {
        //     name: In(query.categories || []),
        //   },
        //   ideaType: IdeaTypeEnum.FREE,
        // },
      ],
    });
    return ideas;
  }

  async findOne(id: string) {
    const idea = await this.ideaRepository.findOne({
      where: { id },
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

  // update(id: number, updateIdeaDto: UpdateIdeaDto) {
  //   return `This action updates a #${id} idea`;
  // }

  remove(id: number) {
    return `This action removes a #${id} idea`;
  }
}
