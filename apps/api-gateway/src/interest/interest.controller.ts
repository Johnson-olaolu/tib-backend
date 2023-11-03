import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { InterestService } from './interest.service';
import { UpdateInterestDto } from './dto/update-interest.dto';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateInterestDto } from '@app/shared/dto/user-service/create-interest.dto';
import { InterestModel } from '@app/shared/model/interest.model';
import { ResponseDto } from '../utils/Response.dto';

@Controller('interest')
@ApiTags('Interest')
@ApiExtraModels(InterestModel)
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @ApiResponse({
    status: 200,
    description: 'Interest created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(InterestModel),
            },
          },
        },
      ],
    },
  })
  @Post()
  async create(@Body() createInterestDto: CreateInterestDto) {
    const data = await this.interestService.create(createInterestDto);
    return {
      success: true,
      message: 'interest created successfully',
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
              type: 'array',
              items: {
                $ref: getSchemaPath(InterestModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll() {
    const data = await this.interestService.findAll();
    return {
      success: true,
      message: 'interests fetched successfully',
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
              type: 'array',
              items: {
                $ref: getSchemaPath(InterestModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get(`query`)
  async query(@Query('name') name: string) {
    const data = await this.interestService.query(name);
    return {
      success: true,
      message: 'interests queried successfully',
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
              $ref: getSchemaPath(InterestModel),
            },
          },
        },
      ],
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.interestService.findOne(id);
    return {
      success: true,
      message: 'interest fetched successfully',
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
              $ref: getSchemaPath(InterestModel),
            },
          },
        },
      ],
    },
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInterestDto: UpdateInterestDto,
  ) {
    const data = await this.interestService.update(id, updateInterestDto);
    return {
      success: true,
      message: 'interest updated successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Interest deleted successfully',
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
    await this.interestService.remove(id);
    return {
      success: true,
      message: 'interest updated successfully',
    };
  }
}
