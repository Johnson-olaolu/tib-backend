import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import {
  defaultPlanPermissions,
  defaultPlans,
  defaultRoles,
} from '../utils/constants';
import { RoleService } from '../role/role.service';
import { PlanPermissionService } from '../plan-permission/plan-permission.service';
import { PlanService } from '../plan/plan.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private roleService: RoleService,
    private planPermissionService: PlanPermissionService,
    private planService: PlanService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
  }

  async seedRoles() {
    for (const role of defaultRoles) {
      let foundRole = null;
      try {
        foundRole = await this.roleService.findOneByName(role.name);
      } catch (error) {}
      if (!foundRole) {
        await this.roleService.create(role);
        this.logger.log(`Role : ${role.name} Seeded`);
      }
    }
  }

  async seedPlanPermission() {
    for (const planPermission of defaultPlanPermissions) {
      let foundPlanPermission = null;
      try {
        foundPlanPermission = await this.planPermissionService.findOneByName(
          planPermission.name,
        );
      } catch (error) {}
      if (!foundPlanPermission) {
        await this.planPermissionService.create(planPermission);
        this.logger.log(`PlanPermission : ${planPermission.name} Seeded`);
      }
    }
  }

  async seedPlan() {
    for (const plan of defaultPlans) {
      let foundPlan = null;
      try {
        foundPlan = await this.planService.findOneByName(plan.name);
      } catch (error) {}
      if (!foundPlan) {
        await this.planService.create(plan);
        this.logger.log(`Plan : ${plan.name} Seeded`);
      }
    }
  }
}
