import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { defaultCategories, defaultIdeaConstants } from '../utils/constants';
import { IdeaConstantsService } from '../idea-constants/idea-constants.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  logger = new Logger(SeedService.name);
  constructor(
    private ideaConstantService: IdeaConstantsService,
    private categoryService: CategoryService,
  ) {}
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

  async seedCategories() {
    for (const interest of defaultCategories) {
      let foundInterest = null;
      try {
        foundInterest = await this.categoryService.findOneByName(interest.name);
      } catch (error) {}
      if (!foundInterest) {
        await this.categoryService.create(interest);
        this.logger.log(`Category: ${interest.name} Seeded`);
      }
    }
  }
}
