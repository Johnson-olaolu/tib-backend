import { Controller, Get } from '@nestjs/common';
import { IdeaServiceService } from './idea-service.service';

@Controller()
export class IdeaServiceController {
  constructor(private readonly ideaServiceService: IdeaServiceService) {}

  @Get()
  getHello(): string {
    return this.ideaServiceService.getHello();
  }
}
