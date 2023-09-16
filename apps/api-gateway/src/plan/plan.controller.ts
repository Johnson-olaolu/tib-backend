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
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../utils/Response.dto';
import { PlanModel } from './model/plan.model';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Plan')
@Controller('plan')
@UseGuards(AuthGuard('jwt'))
@ApiExtraModels(PlanModel)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.planService.create(createPlanDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Plans fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(PlanModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll(): Promise<ResponseDto<PlanModel[]>> {
    const plans = await this.planService.findAll();
    return {
      message: 'Plans fetched successfully',
      status: true,
      data: plans,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.planService.update(+id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planService.remove(+id);
  }
}
