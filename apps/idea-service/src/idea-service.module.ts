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

@Module({
  imports: [
    IdeaModule,
    CommentModule,
    LikeModule,
    DatabaseModule,
    RmqModule,
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
