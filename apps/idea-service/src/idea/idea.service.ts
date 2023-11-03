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
import { Repository } from 'typeorm';
import { IdeaNeedEnum, IdeaTypeEnum } from '../utils/constants';
import { FileTypeEnum, RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';
import { FileModel } from '@app/shared/model/file.model';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    @Inject(RABBITMQ_QUEUES.FILE_SERVICE) private fileClient: ClientProxy,
  ) {}

  async createIdeaSimple(createIdeaSimpleDto: CreateIdeaSimpleDto) {
    const idea = await this.ideaRepository.save({
      ...createIdeaSimpleDto,
      media: [],
    });

    const ideaFiles: string[] = [];
    for (let i = 0; i < createIdeaSimpleDto.media.length; i++) {
      // console.log(file);
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
    idea.ideaType = IdeaTypeEnum.SHARED;
    idea.media = ideaFiles;
    // await idea.save();
    await this.ideaRepository.save(idea);
    return idea;
  }

  async createIdeaFundingNeeded(
    createIdeaFundingNeededDto: CreateIdeaFundingNeededDto,
  ) {
    const idea = await this.ideaRepository.create(createIdeaFundingNeededDto);
    idea.ideaType = IdeaTypeEnum.VAULT;
    idea.ideaNeed = IdeaNeedEnum.FUNDING;
    await idea.save();
    return idea;
  }

  async createIdeaForSale(createIdeaForSaleDto: CreateIdeaForSaleDto) {
    const idea = await this.ideaRepository.create(createIdeaForSaleDto);
    idea.ideaType = IdeaTypeEnum.VAULT;
    idea.ideaNeed = IdeaNeedEnum.SALE;
    await idea.save();
    return idea;
  }

  async createIdeaNewConcept(createIdeaNewConceptDto: CreateIdeaNewConceptDto) {
    const idea = await this.ideaRepository.create(createIdeaNewConceptDto);
    idea.ideaType = IdeaTypeEnum.VAULT;
    idea.ideaNeed = IdeaNeedEnum.SALE;
    await idea.save();
    return idea;
  }

  async findAll(query: Record<string, string>) {
    const ideas = await this.ideaRepository.find({
      where: query,
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
