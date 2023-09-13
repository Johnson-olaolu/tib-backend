import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { FileServiceService } from './file-service.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private logger = new Logger(SeedService.name);
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    private fileService: FileServiceService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedfiles();
  }

  async seedfiles() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _ = this;
    const directoryPath = join(__dirname, 'public/default');
    fs.readdir(directoryPath, function (err, files) {
      //handling error
      if (err) {
        return console.log('Unable to scan directory: ' + err);
      }
      //listing all files using forEach

      files.forEach(async function (file) {
        // Do whatever you want to do with the file
        let foundFile = null;
        try {
          foundFile = await _.fileService.getFile({ name: file });
        } catch (error) {}
        if (!foundFile) {
          const fileDetails: Partial<File> = {
            name: file,
            path: '/public/default/' + file,
            ownerId: 'the_idea_bank',
          };
          const newFile = await _.fileRepository.save(fileDetails);
          _.logger.log(`File : ${newFile.name} Seeded`);
        }
      });
    });
  }
}
