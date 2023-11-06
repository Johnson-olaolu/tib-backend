import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CategoryModel } from '@app/shared/model/category.model';
import { ResponseDto } from '../utils/Response.dto';
import { CreateCategoryDto } from '@app/shared/dto/user-service/create-category.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@ApiTags('Category')
@ApiExtraModels(CategoryModel)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiResponse({
    status: 200,
    description: 'Category created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(CategoryModel),
            },
          },
        },
      ],
    },
  })
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const data = await this.categoryService.create(createCategoryDto);
    return {
      success: true,
      message: 'Category created successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Categories fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(CategoryModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();
    return {
      success: true,
      message: 'Categories fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Categories fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(CategoryModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get(`query`)
  async query(@Query('name') name: string) {
    const data = await this.categoryService.query(name);
    return {
      success: true,
      message: 'Categories queried successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Category fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(CategoryModel),
            },
          },
        },
      ],
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.categoryService.findOne(id);
    return {
      success: true,
      message: 'Category fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(CategoryModel),
            },
          },
        },
      ],
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    const data = await this.categoryService.update(id, updateCategoryDto);
    return {
      success: true,
      message: 'Category updated successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: null,
          },
        },
      ],
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.categoryService.remove(id);
    return {
      success: true,
      message: 'Category updated successfully',
    };
  }
}
