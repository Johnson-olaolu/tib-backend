import { Inject, Injectable } from '@nestjs/common';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CategoryModel } from '@app/shared/model/category.model';
import { lastValueFrom } from 'rxjs';
import { CreateCategoryDto } from '@app/shared/dto/user-service/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(RABBITMQ_QUEUES.IDEA_SERVICE) private ideaClient: ClientProxy,
  ) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await lastValueFrom(
      this.ideaClient.send<CategoryModel>('createCategory', createCategoryDto),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return category;
  }

  async findAll() {
    const categories = await lastValueFrom(
      this.ideaClient.send<CategoryModel[]>('findAllCategory', {}),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return categories;
  }

  async findOne(id: string) {
    const category = await lastValueFrom(
      this.ideaClient.send<CategoryModel>('findOneCategory', id),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return category;
  }

  async query(name: string) {
    const categories = await lastValueFrom(
      this.ideaClient.send<CategoryModel[]>('queryCategory', name),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return categories;
  }

  async update(id: string, updateCategoryDto: CreateCategoryDto) {
    const category = await lastValueFrom(
      this.ideaClient.send<CategoryModel>('updateCategory', {
        id,
        ...updateCategoryDto,
      }),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return category;
  }

  async remove(id: string) {
    const response = await lastValueFrom(
      this.ideaClient.send<boolean>('deleteCategory', id),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return response;
  }
}
