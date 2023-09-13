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

@Controller()
export class FileServiceController {
  constructor(private readonly fileServiceService: FileServiceService) {}

  @Get()
  queryFiles() {
    return;
  }

  @Post('getFileRoute')
  getFileRoute(@Body() getFileDto: GetFileDto) {
    const fileRoute = this.fileServiceService.getFileRoute(getFileDto);
    return fileRoute;
  }
}
