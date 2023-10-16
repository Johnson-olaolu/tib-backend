import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIdeaConstantDto } from '../../../../libs/shared/src/dto/idea/create-idea-constant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { IdeaConstant } from './entities/idea-constant.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class IdeaConstantsService {
  constructor(
    @InjectRepository(IdeaConstant)
    private ideaConstantRepository: Repository<IdeaConstant>,
  ) {}
  async create(createIdeaConstantDto: CreateIdeaConstantDto) {
    const newIdeaConstant = await this.ideaConstantRepository.save(
      createIdeaConstantDto,
    );
    return newIdeaConstant;
  }

  async findAll() {
    const ideaConstants = await this.ideaConstantRepository.find();
    return ideaConstants;
  }

  async findOne(id: string) {
    const ideaConstant = await this.ideaConstantRepository.findOne({
      where: {
        id,
      },
    });
    if (!ideaConstant) {
      throw new RpcException(
        new NotFoundException('No Idea Constant Found For This ID'),
      );
    }
    return ideaConstant;
  }

  async findOneByName(name: string) {
    const ideaConstant = await this.ideaConstantRepository.findOne({
      where: {
        name,
      },
    });
    if (!ideaConstant) {
      throw new RpcException(
        new NotFoundException('No Idea Constant Found For This Name'),
      );
    }
    return ideaConstant;
  }

  async update(id: string, value: string[]) {
    const ideaConstant = await this.findOne(id);
    ideaConstant.value = value;
    await ideaConstant.save();
    return ideaConstant;
  }

  async updateByName(name: string, value: string[]) {
    const ideaConstant = await this.findOneByName(name);
    ideaConstant.value = value;
    await ideaConstant.save();
    return ideaConstant;
  }

  async remove(id: string) {
    const deleteResponse = await this.ideaConstantRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RpcException(
        new NotFoundException('Idea Constant not found for this ID'),
      );
    }
  }

  async removeByName(name: string) {
    const deleteResponse = await this.ideaConstantRepository.delete({ name });
    if (!deleteResponse.affected) {
      throw new RpcException(
        new NotFoundException('Idea Constant not found for this Name'),
      );
    }
  }
}
