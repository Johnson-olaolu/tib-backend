import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileServiceService } from './file-service.service';
import { GetFileDto } from '@app/shared/dto/file/get-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MessagePattern } from '@nestjs/microservices';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';

@Controller()
export class FileServiceController {
  constructor(private readonly fileServiceService: FileServiceService) {}

  @Get()
  queryFiles() {
    return;
  }

  @MessagePattern('saveFile')
  async saveFile(@Body() SaveFileDto: SaveFileDto) {
    const file = await this.fileServiceService.saveFile(SaveFileDto);
    return file;
  }
  @MessagePattern('getFile')
  async getFile(@Body() getFileDto: GetFileDto) {
    const file = await this.fileServiceService.getFile(getFileDto.title);
    return file;
  }
  @MessagePattern('updateFile')
  async updateFile(@Body() SaveFileDto: SaveFileDto) {
    const file = await this.fileServiceService.updateFile(SaveFileDto);
    return file;
  }
}
