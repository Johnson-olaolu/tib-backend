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
    await this.seedCategories();
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
    for (const category of defaultCategories) {
      let foundCategory = null;
      try {
        foundCategory = await this.categoryService.findOneByName(category.name);
      } catch (error) {}
      if (!foundCategory) {
        await this.categoryService.create(category);
        this.logger.log(`Category: ${category.name} Seeded`);
      }
    }
  }
}
