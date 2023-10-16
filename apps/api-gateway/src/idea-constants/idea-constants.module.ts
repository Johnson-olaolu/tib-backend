import { Module } from '@nestjs/common';
import { IdeaConstantsService } from './idea-constants.service';
import { IdeaConstantsController } from './idea-constants.controller';

@Module({
  controllers: [IdeaConstantsController],
  providers: [IdeaConstantsService]
})
export class IdeaConstantsModule {}
