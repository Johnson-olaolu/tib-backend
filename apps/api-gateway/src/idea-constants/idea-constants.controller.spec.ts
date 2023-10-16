import { Test, TestingModule } from '@nestjs/testing';
import { IdeaConstantsController } from './idea-constants.controller';
import { IdeaConstantsService } from './idea-constants.service';

describe('IdeaConstantsController', () => {
  let controller: IdeaConstantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeaConstantsController],
      providers: [IdeaConstantsService],
    }).compile();

    controller = module.get<IdeaConstantsController>(IdeaConstantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
