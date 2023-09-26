import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';

@Controller()
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @MessagePattern('createIdea')
  create(@Payload() createIdeaDto: CreateIdeaDto) {
    return this.ideaService.create(createIdeaDto);
  }

  @MessagePattern('findAllIdea')
  findAll() {
    return this.ideaService.findAll();
  }

  @MessagePattern('findOneIdea')
  findOne(@Payload() id: number) {
    return this.ideaService.findOne(id);
  }

  @MessagePattern('updateIdea')
  update(@Payload() updateIdeaDto: UpdateIdeaDto) {
    return this.ideaService.update(updateIdeaDto.id, updateIdeaDto);
  }

  @MessagePattern('removeIdea')
  remove(@Payload() id: number) {
    return this.ideaService.remove(id);
  }
}
