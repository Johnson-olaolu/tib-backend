import { Module } from '@nestjs/common';
import { IdeaServiceController } from './idea-service.controller';
import { IdeaServiceService } from './idea-service.service';
import { IdeaModule } from './idea/idea.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { DatabaseModule } from '@app/database';
import { RmqModule } from '@app/rmq';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env.validate';
import { IdeaConstantsModule } from './idea-constants/idea-constants.module';
import { SeedService } from './seed/seed.service';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';

@Module({
  imports: [
    IdeaModule,
    CommentModule,
    LikeModule,
    DatabaseModule,
    RmqModule,
    RmqModule.register({ name: RABBITMQ_QUEUES.FILE_SERVICE }),
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    IdeaConstantsModule,
  ],
  controllers: [IdeaServiceController],
  providers: [IdeaServiceService, SeedService],
})
export class IdeaServiceModule {}
