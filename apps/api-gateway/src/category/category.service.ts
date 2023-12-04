import { Inject, Injectable } from '@nestjs/common';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CategoryModel } from '@app/shared/model/category.model';
import { lastValueFrom } from 'rxjs';
import { CreateCategoryDto } from '@app/shared/dto/user-service/create-category.dto';
import { LikeModel } from '@app/shared/model/like.model';
import { IdeaModel } from '@app/shared/model/idea.model';
import { ShareModel } from '@app/shared/model/share.model';
import { UserModel } from '@app/shared/model/user.model';

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

  async findOneByName(name: string) {
    const category = await lastValueFrom(
      this.ideaClient.send<CategoryModel>('findOneByName', name),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return category;
  }

  async getCategoryDetails(id: string) {
    const categoryIdeaDetails = await lastValueFrom(
      this.ideaClient.send<{
        likes: LikeModel[];
        sharedIdeas: IdeaModel[];
        likedIdeas: IdeaModel[];
        shares: ShareModel[];
        mostViewed: IdeaModel[];
      }>('fetchCategoryIdeaDetails', id),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return categoryIdeaDetails;
  }

  async getCategoryFollowers(id: string) {
    const followers = await lastValueFrom(
      this.ideaClient.send<UserModel[]>('getCategoryFollowers', id),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return followers;
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
