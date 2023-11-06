import { CreateCategoryDto } from '@app/shared/dto/user-service/create-category.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { ILike, Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.save(createCategoryDto);
    return category;
  }

  async findAll() {
    const categories = await this.categoryRepository.find();
    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new RpcException(
        new NotFoundException('Category not found for this ID'),
      );
    }
    return category;
  }

  async findOneByName(name: string) {
    const category = await this.categoryRepository.findOne({
      where: { name },
    });
    if (!category) {
      throw new RpcException(
        new NotFoundException('Category not found for this Name'),
      );
    }
    return category;
  }

  async queryCategory(name: string) {
    const categories = await this.categoryRepository.find({
      where: {
        name: ILike(`%${name}%`),
      },
    });
    return categories;
  }

  async update(
    id: string,
    updateCategoryDto: CreateCategoryDto & { id: string },
  ) {
    const category = await this.findOne(id);
    delete updateCategoryDto.id;

    for (const detail in updateCategoryDto) {
      category[detail] = updateCategoryDto[detail];
    }
    await category.save();
    return category;
  }

  async remove(id: string) {
    const deleteResponse = await this.categoryRepository.delete({ id });
    if (!deleteResponse.affected) {
      throw new RpcException(
        new NotFoundException('Category not found for this Name'),
      );
    }
  }
}
