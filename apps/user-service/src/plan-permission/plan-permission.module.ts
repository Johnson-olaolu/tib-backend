import { Module } from '@nestjs/common';
import { PlanPermissionService } from './plan-permission.service';
import { PlanPermissionController } from './plan-permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanPermision } from './entities/plan-permission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PlanPermision])],
  controllers: [PlanPermissionController],
  providers: [PlanPermissionService],
  exports: [PlanPermissionService],
})
export class PlanPermissionModule {}
