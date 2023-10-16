import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdeaConstantsService } from './idea-constants.service';
import { CreateIdeaConstantDto } from '../../../../libs/shared/src/dto/idea/create-idea-constant.dto';
import { UpdateIdeaConstantDto } from '../../../../libs/shared/src/dto/idea/update-idea-constant.dto';

@Controller()
export class IdeaConstantsController {
  constructor(private readonly ideaConstantsService: IdeaConstantsService) {}

  @MessagePattern('createIdeaConstant')
  create(@Payload() createIdeaConstantDto: CreateIdeaConstantDto) {
    return this.ideaConstantsService.create(createIdeaConstantDto);
  }

  @MessagePattern('findAllIdeaConstants')
  findAll() {
    return this.ideaConstantsService.findAll();
  }

  @MessagePattern('findOneIdeaConstant')
  findOne(@Payload() id: string) {
    return this.ideaConstantsService.findOne(id);
  }

  @MessagePattern('findOneIdeaConstantByName')
  findOneByName(@Payload() name: string) {
    return this.ideaConstantsService.findOneByName(name);
  }

  @MessagePattern('updateIdeaConstant')
  update(@Payload() updateIdeaConstantDto: UpdateIdeaConstantDto) {
    return this.ideaConstantsService.update(
      updateIdeaConstantDto.id,
      updateIdeaConstantDto.value,
    );
  }

  @MessagePattern('updateIdeaConstantByName')
  updateByName(@Payload() updateIdeaConstantDto: UpdateIdeaConstantDto) {
    return this.ideaConstantsService.updateByName(
      updateIdeaConstantDto.name,
      updateIdeaConstantDto.value,
    );
  }

  @MessagePattern('removeIdeaConstant')
  remove(@Payload() id: string) {
    return this.ideaConstantsService.remove(id);
  }

  @MessagePattern('removeIdeaConstantByName')
  removeByName(@Payload() name: string) {
    return this.ideaConstantsService.remove(name);
  }
}
