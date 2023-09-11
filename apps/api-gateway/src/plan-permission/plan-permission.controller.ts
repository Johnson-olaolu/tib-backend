import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PlanPermissionService } from './plan-permission.service';
import { CreatePlanPermissionDto } from './dto/create-plan-permission.dto';
import { UpdatePlanPermissionDto } from './dto/update-plan-permission.dto';

@Controller('plan-permission')
export class PlanPermissionController {
  constructor(private readonly planPermissionService: PlanPermissionService) {}

  @Post()
  create(@Body() createPlanPermissionDto: CreatePlanPermissionDto) {
    return this.planPermissionService.create(createPlanPermissionDto);
  }

  @Get()
  findAll() {
    return this.planPermissionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planPermissionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanPermissionDto: UpdatePlanPermissionDto) {
    return this.planPermissionService.update(+id, updatePlanPermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planPermissionService.remove(+id);
  }
}
