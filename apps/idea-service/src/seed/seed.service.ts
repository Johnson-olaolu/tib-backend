import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { defaultIdeaConstants } from '../utils/constants';
import { IdeaConstantsService } from '../idea-constants/idea-constants.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  logger = new Logger(SeedService.name);
  constructor(private ideaConstantService: IdeaConstantsService) {}
  async onApplicationBootstrap() {
    await this.seedIdeaConstants();
  }

  async seedIdeaConstants() {
    for (const ideaConstant of defaultIdeaConstants) {
      try {
        const existingIdeaConstant = await this.ideaConstantService.create(
          ideaConstant,
        );
        this.logger.log(
          `Created new Idea Constant ${existingIdeaConstant.name}`,
        );
      } catch (error) {}
    }
  }
}
