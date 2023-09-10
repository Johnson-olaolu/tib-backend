import { Test, TestingModule } from '@nestjs/testing';
import { PlanPermissionController } from './plan-permission.controller';
import { PlanPermissionService } from './plan-permission.service';

describe('PlanPermissionController', () => {
  let controller: PlanPermissionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlanPermissionController],
      providers: [PlanPermissionService],
    }).compile();

    controller = module.get<PlanPermissionController>(PlanPermissionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
