import { Test, TestingModule } from '@nestjs/testing';
import { IdeaConstantsService } from './idea-constants.service';

describe('IdeaConstantsService', () => {
  let service: IdeaConstantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdeaConstantsService],
    }).compile();

    service = module.get<IdeaConstantsService>(IdeaConstantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
