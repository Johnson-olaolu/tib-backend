import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join, parse } from 'path';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { FileServiceService } from './file-service.service';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';
import * as mime from 'mime-types';
import { FileTypeEnum } from '@app/shared/utils/constants';

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
      files.forEach(async function (file) {
        const name = parse(file).name;

        try {
          await _.fileService.getFile(name);
        } catch (error) {
          fs.readFile(join(directoryPath, file), async (err, data) => {
            if (err) {
              return console.log('Unable to read file ' + err);
            }
            const saveFileDto: SaveFileDto = {
              author: 'SuperAdmin',
              file: { buffer: data.toJSON() } as any,
              mimetype: mime.contentType(file) || '',
              name: name,
              parent: 'SuperAdmin',
              type: FileTypeEnum.APP,
            };
            const seededFile = await _.fileService.saveFile(saveFileDto);
            _.logger.log(`File: ${seededFile.name} Seeded`);
          });
        }
      });
    });
  }
}
