import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import {
  CreateIdeaForSaleDto,
  CreateIdeaFundingNeededDto,
  CreateIdeaNewConceptDto,
  CreateIdeaSimpleDto,
} from '@app/shared/dto/idea/create-idea.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { IdeaModel } from '@app/shared/model/idea.model';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from '../utils/Response.dto';

@ApiTags('Idea')
@ApiExtraModels(IdeaModel)
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @ApiResponse({
    status: 200,
    description: 'Idea created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaModel),
            },
          },
        },
      ],
    },
  })
  @Post('simple')
  async createIdeaSimple(@Body() createIdeaSimpleDto: CreateIdeaSimpleDto) {
    const data = await this.ideaService.createIdeaSimple(createIdeaSimpleDto);
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaModel),
            },
          },
        },
      ],
    },
  })
  @Post('funding-needed')
  async createIdeaFundingNeeded(
    @Body() createIdeaFundingNeededDto: CreateIdeaFundingNeededDto,
  ) {
    const data = await this.ideaService.createIdeaFundingNeeded(
      createIdeaFundingNeededDto,
    );
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaModel),
            },
          },
        },
      ],
    },
  })
  @Post('for-sale')
  async createIdeaForSale(@Body() createIdeaForSaleDto: CreateIdeaForSaleDto) {
    const data = await this.ideaService.createIdeaForSale(createIdeaForSaleDto);
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaModel),
            },
          },
        },
      ],
    },
  })
  @Post('new-concept')
  async createIdea(@Body() createIdeaNewConceptDto: CreateIdeaNewConceptDto) {
    const data = await this.ideaService.createIdeaNewConcept(
      createIdeaNewConceptDto,
    );
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  @Get()
  findAll() {
    return this.ideaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ideaService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
  //   return this.ideaService.update(+id, updateIdeaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ideaService.remove(+id);
  // }
}
