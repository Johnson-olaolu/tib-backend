import { Test, TestingModule } from '@nestjs/testing';
import { IdeaServiceController } from './idea-service.controller';
import { IdeaServiceService } from './idea-service.service';

describe('IdeaServiceController', () => {
  let ideaServiceController: IdeaServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IdeaServiceController],
      providers: [IdeaServiceService],
    }).compile();

    ideaServiceController = app.get<IdeaServiceController>(IdeaServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(ideaServiceController.getHello()).toBe('Hello World!');
    });
  });
});
