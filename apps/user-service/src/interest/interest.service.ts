import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Interest } from './entities/interest.entity';
import { CreateInterestDto } from '@app/shared/dto/user-service/create-interest.dto';

@Injectable()
export class InterestService {
  constructor(
    @InjectRepository(Interest)
    private interestRepository: Repository<Interest>,
  ) {}
  async create(createInterestDto: CreateInterestDto) {
    const interest = await this.interestRepository.create(createInterestDto);
    return interest;
  }

  async findAll() {
    const interests = await this.interestRepository.find();
    return interests;
  }

  async findOne(id: string) {
    const interest = await this.interestRepository.findOneBy({ id });
    if (!interest) {
      throw new NotFoundException('Could not find interest for this ID');
    }
    return interest;
  }

  async findOneByName(name: string) {
    const interest = await this.interestRepository.findOneBy({ name });
    if (!interest) {
      throw new NotFoundException('Could not find interest for this name');
    }
    return interest;
  }

  async update(id: string, updateInterestDto: UpdateInterestDto) {
    const interest = await this.findOne(id);

    for (const detail in updateInterestDto) {
      interest[detail] = updateInterestDto[detail];
    }
    await interest.save();
    return interest;
  }

  remove(id: number) {
    return `This action removes a #${id} interest`;
  }
}
