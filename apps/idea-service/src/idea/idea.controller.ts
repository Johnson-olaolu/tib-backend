import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IdeaService } from './idea.service';
import {
  CreateIdeaForSaleDto,
  CreateIdeaFundingNeededDto,
  CreateIdeaNewConceptDto,
  CreateIdeaSimpleDto,
} from '@app/shared/dto/idea/create-idea.dto';

@Controller()
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @MessagePattern('createIdeaSimple')
  createIdeaSimple(@Payload() createIdeaSimpleDto: CreateIdeaSimpleDto) {
    return this.ideaService.createIdeaSimple(createIdeaSimpleDto);
  }

  @MessagePattern('createIdeaFundingNeeded')
  createIdeaFundingNeeded(
    @Payload() createIdeaFundingNeededDto: CreateIdeaFundingNeededDto,
  ) {
    return this.ideaService.createIdeaFundingNeeded(createIdeaFundingNeededDto);
  }

  @MessagePattern('createIdeaForSale')
  createIdeaForSale(@Payload() createIdeaForSaleDto: CreateIdeaForSaleDto) {
    return this.ideaService.createIdeaForSale(createIdeaForSaleDto);
  }

  @MessagePattern('createIdeaNewConcept')
  createIdeaNewConcept(
    @Payload() createIdeaNewConceptDto: CreateIdeaNewConceptDto,
  ) {
    return this.ideaService.createIdeaNewConcept(createIdeaNewConceptDto);
  }

  @MessagePattern('findAllIdea')
  findAll() {
    return this.ideaService.findAll();
  }

  @MessagePattern('findOneIdea')
  findOne(@Payload() id: string) {
    return this.ideaService.findOne(id);
  }

  @MessagePattern('findOneIdeaByTitle')
  findOneByTitle(@Payload() title: string) {
    return this.ideaService.findOneByTitle(title);
  }

  // @MessagePattern('updateIdea')
  // update(@Payload() updateIdeaDto: UpdateIdeaDto) {
  //   return this.ideaService.update(updateIdeaDto.id, updateIdeaDto);
  // }

  @MessagePattern('removeIdea')
  remove(@Payload() id: number) {
    return this.ideaService.remove(id);
  }
}
