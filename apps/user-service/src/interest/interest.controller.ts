import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InterestService } from './interest.service';
import { CreateInterestDto } from './dto/create-interest.dto';
import { UpdateInterestDto } from './dto/update-interest.dto';

@Controller()
export class InterestController {
  constructor(private readonly interestService: InterestService) {}

  @MessagePattern('createInterest')
  create(@Payload() createInterestDto: CreateInterestDto) {
    return this.interestService.create(createInterestDto);
  }

  @MessagePattern('findAllInterest')
  findAll() {
    return this.interestService.findAll();
  }

  @MessagePattern('findOneInterest')
  findOne(@Payload() id: number) {
    return this.interestService.findOne(id);
  }

  @MessagePattern('updateInterest')
  update(@Payload() updateInterestDto: UpdateInterestDto) {
    return this.interestService.update(updateInterestDto.id, updateInterestDto);
  }

  @MessagePattern('removeInterest')
  remove(@Payload() id: number) {
    return this.interestService.remove(id);
  }
}
