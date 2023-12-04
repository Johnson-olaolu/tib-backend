import { Module } from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Idea } from './entities/idea.entity';
import { CategoryModule } from '../category/category.module';
import { Share } from './entities/share.entity';
import { Like } from './entities/like.entity';
import { Comment } from './entities/comment.entity';
import { View } from './entities/view.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Idea, Share, Like, Comment, View]),
    CategoryModule,
  ],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}
