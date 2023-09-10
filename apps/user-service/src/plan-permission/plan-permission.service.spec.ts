import { Test, TestingModule } from '@nestjs/testing';
import { PlanPermissionService } from './plan-permission.service';

describe('PlanPermissionService', () => {
  let service: PlanPermissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlanPermissionService],
    }).compile();

    service = module.get<PlanPermissionService>(PlanPermissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
