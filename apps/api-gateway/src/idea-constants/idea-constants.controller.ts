import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IdeaConstantsService } from './idea-constants.service';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { IdeaConstantModel } from '@app/shared/model/idea-constant.model';
import { CreateIdeaConstantDto } from '@app/shared/dto/idea/create-idea-constant.dto';
import { ResponseDto } from '../utils/Response.dto';
import { UpdateIdeaConstantDto } from '@app/shared/dto/idea/update-idea-constant.dto';
import RoleGuard from '../guards/roleGuards.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Idea Constants')
@ApiExtraModels(IdeaConstantModel)
@Controller('idea-constants')
export class IdeaConstantsController {
  constructor(private readonly ideaConstantsService: IdeaConstantsService) {}

  @ApiResponse({
    status: 200,
    description: 'Idea Constant created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaConstantModel),
            },
          },
        },
      ],
    },
  })
  @UseGuards(RoleGuard(['super_admin', ' admin']))
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createIdeaConstantDto: CreateIdeaConstantDto) {
    const data = this.ideaConstantsService.create(createIdeaConstantDto);
    return {
      success: true,
      message: 'interest created successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea Constants fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(IdeaConstantModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll() {
    const data = await this.ideaConstantsService.findAll();
    return {
      success: true,
      message: 'Idea-constants fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Interest fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaConstantModel),
            },
          },
        },
      ],
    },
  })
  @Get('findByName')
  async findOneByName(@Query('name') name: string) {
    const data = await this.ideaConstantsService.findOneByName(name);
    return {
      success: true,
      message: 'Idea-constant fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Interest fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaConstantModel),
            },
          },
        },
      ],
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.ideaConstantsService.findOne(id);
    return {
      success: true,
      message: 'Idea-constant fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Interest updated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaConstantModel),
            },
          },
        },
      ],
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIdeaConstantDto: Omit<UpdateIdeaConstantDto, 'id'>,
  ) {
    const data = await this.ideaConstantsService.update({
      ...updateIdeaConstantDto,
      id,
    });
    return {
      success: true,
      message: 'Idea-constant fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea-constant deleted successfully',
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
    await this.ideaConstantsService.remove(id);
    return {
      success: true,
      message: 'Idea-constant deleted successfully',
    };
  }
}
