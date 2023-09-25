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
import { UpdatePlanDto } from './dto/update-plan.dto';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../utils/Response.dto';
import { PlanModel } from './model/plan.model';
import { AuthGuard } from '@nestjs/passport';
import RoleGuard from '../guards/roleGuards.guard';
import { CreatePlanDto } from '@app/shared/dto/user-service/create-plan.dto';

@ApiTags('Plan')
@ApiBearerAuth()
@Controller('plan')
@UseGuards(AuthGuard('jwt'))
@ApiExtraModels(PlanModel)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @ApiResponse({
    status: 200,
    description: 'Plan created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PlanModel),
            },
          },
        },
      ],
    },
  })
  @UseGuards(RoleGuard(['super_admin', ' admin']))
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

  @ApiResponse({
    status: 200,
    description: 'Plan fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PlanModel),
            },
          },
        },
      ],
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const plan = await this.planService.findOne(id);
    return {
      message: 'Plan fetched successfully',
      status: true,
      data: plan,
    };
  }

  @ApiResponse({
    status: 201,
    description: 'Plan updated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PlanModel),
            },
          },
        },
      ],
    },
  })
  @UseGuards(RoleGuard(['super_admin', ' admin']))
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    const plan = await this.planService.update(id, updatePlanDto);
    return {
      message: 'Plan updated successfully',
      status: true,
      data: plan,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Plan deleted successfully',
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
  @UseGuards(RoleGuard(['super_admin', ' admin']))
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.planService.remove(id);
    return {
      message: 'Plan updated successfully',
      status: true,
    };
  }
}
