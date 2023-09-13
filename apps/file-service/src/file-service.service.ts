import { GetFileDto } from '@app/shared/dto/file/get-file.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { RpcException } from '@nestjs/microservices';
import { app } from './main';

@Injectable()
export class FileServiceService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}
  async getFile(getFileDto: GetFileDto) {
    const file = await this.fileRepository.findOneBy({
      name: getFileDto.name,
    });
    if (!file) {
      throw new RpcException(new NotFoundException('Could Not find File'));
    }
    return file;
  }

  async getFileRoute(getFileDto: GetFileDto) {
    const file = await this.fileRepository.findOneBy({
      name: getFileDto.name,
    });
    if (!file) {
      throw new RpcException(new NotFoundException('Could Not find File'));
    }
    const url = await app.getUrl();
    console.log(url.replace('[::1]', 'localhost'));
    // console.log(url + file.path);
    return url.replace('[::1]', 'localhost') + file.path;
  }

  // async saveFile()
}
