import { Module } from '@nestjs/common';
import { PlanPermissionService } from './plan-permission.service';
import { PlanPermissionController } from './plan-permission.controller';

@Module({
  controllers: [PlanPermissionController],
  providers: [PlanPermissionService]
})
export class PlanPermissionModule {}
