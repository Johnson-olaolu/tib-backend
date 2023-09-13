import { Module } from '@nestjs/common';
import { FileServiceController } from './file-service.controller';
import { FileServiceService } from './file-service.service';
import { RmqModule } from '@app/rmq';
import { ConfigModule } from '@nestjs/config';
import { validateEnv } from './utils/env.validation';
import { DatabaseModule } from '@app/database';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SeedService } from './seed.service';

@Module({
  imports: [
    RmqModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'public'),
      serveRoot: '/public/',
    }),
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    TypeOrmModule.forFeature([File]),
  ],
  controllers: [FileServiceController],
  providers: [FileServiceService, SeedService],
})
export class FileServiceModule {}
