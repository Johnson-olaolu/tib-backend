import { Module } from '@nestjs/common';
import { IdeaConstantsService } from './idea-constants.service';
import { IdeaConstantsController } from './idea-constants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeaConstant } from './entities/idea-constant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdeaConstant])],
  controllers: [IdeaConstantsController],
  providers: [IdeaConstantsService],
  exports: [IdeaConstantsService],
})
export class IdeaConstantsModule {}
