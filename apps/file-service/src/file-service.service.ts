import { GetFileDto } from '@app/shared/dto/file/get-file.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { RpcException } from '@nestjs/microservices';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';
import { join } from 'path';
import * as fs from 'fs';
import { FileTypeEnum } from '@app/shared/utils/constants';
import * as mime from 'mime-types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileServiceService {
  private defaultPath = join(__dirname, 'public');
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
    private configService: ConfigService,
  ) {}

  getFileRoute(file: File) {
    const path = this.configService.get('BASE_URL') + file.path;
    file.path = path;
    return file;
  }

  async generatePath(
    file: Express.Multer.File,
    type: FileTypeEnum,
    name: string,
    mimeType: string,
  ) {
    let directory = '';
    switch (type) {
      case FileTypeEnum.APP:
        directory = join(this.defaultPath, 'app');
        break;
      case FileTypeEnum.PROFILE:
        directory = join(this.defaultPath, 'profile');
        break;
      default:
        break;
    }
    const path = join(directory, name + `.${mime.extension(mimeType)}`);

    await fs.writeFile(path, Buffer.from(file.buffer), (err) => {
      if (err) console.log(err);
      else {
        console.log('File written successfully\n');
      }
    });
    return {
      path: path.replace(__dirname, ''),
      name: name + `.${mime.extension(mimeType)}`,
    };
  }

  async saveFile(saveFileDto: SaveFileDto) {
    const fileData = await this.generatePath(
      saveFileDto.file,
      saveFileDto.type,
      saveFileDto.name,
      saveFileDto.mimetype,
    );
    const savedfile = await this.fileRepository.save({
      author: saveFileDto.author,
      name: fileData.name,
      path: fileData.path,
      type: saveFileDto.type,
      title: saveFileDto.name,
      ownerId: saveFileDto.parent,
      mimeType: saveFileDto.mimetype,
    });
    return this.getFileRoute(savedfile);
  }

  async getFile(title: string) {
    const file = await this.fileRepository.findOneBy({ title });
    if (!file) {
      throw new RpcException(new NotFoundException('File Not Found'));
    }
    return file;
  }

  async updateFile(saveFileDto: SaveFileDto) {
    const file = await this.getFile(saveFileDto.name);
    await fs.unlink(join(this.defaultPath, file.path), (err) => {
      if (err) console.log(err);
      else {
        console.log('File deleted successfully\n');
      }
    });
    const fileData = await this.generatePath(
      saveFileDto.file,
      saveFileDto.type,
      saveFileDto.name,
      saveFileDto.mimetype,
    );
    file.mimeType = saveFileDto.mimetype;
    file.name = fileData.name;
    file.path = fileData.path;

    await file.save();
    return this.getFileRoute(file);
  }
}
