import { Module } from '@nestjs/common';
import { IdeaServiceController } from './idea-service.controller';
import { IdeaServiceService } from './idea-service.service';
import { IdeaModule } from './idea/idea.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { DatabaseModule } from '@app/database';
import { RmqModule } from '@app/rmq';

@Module({
  imports: [IdeaModule, CommentModule, LikeModule, DatabaseModule],
  controllers: [IdeaServiceController],
  providers: [IdeaServiceService],
})
export class IdeaServiceModule {}
