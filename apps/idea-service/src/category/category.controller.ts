import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from '@app/shared/dto/user-service/create-category.dto';

@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @MessagePattern('createCategory')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @MessagePattern('findAllCategory')
  findAll() {
    return this.categoryService.findAll();
  }

  @MessagePattern('findOneCategory')
  findOne(@Payload() id: string) {
    return this.categoryService.findOne(id);
  }

  @MessagePattern('queryCategory')
  queryCategory(@Payload() name: string) {
    return this.categoryService.queryCategory(name);
  }

  @MessagePattern('updateCategory')
  update(@Payload() updateCategoryDto: CreateCategoryDto & { id: string }) {
    return this.categoryService.update(updateCategoryDto.id, updateCategoryDto);
  }

  @MessagePattern('removeCategory')
  remove(@Payload() id: string) {
    return this.categoryService.remove(id);
  }
}
