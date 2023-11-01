import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InterestService } from './interest.service';
import { UpdateInterestDto } from './dto/update-interest.dto';
import { CreateInterestDto } from '@app/shared/dto/user-service/create-interest.dto';

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
  findOne(@Payload() id: string) {
    return this.interestService.findOne(id);
  }

  @MessagePattern('queryInterest')
  query(@Payload() name: string) {
    return this.interestService.query(name);
  }

  @MessagePattern('updateInterest')
  update(@Payload() updateInterestDto: UpdateInterestDto) {
    return this.interestService.update(updateInterestDto.id, updateInterestDto);
  }

  @MessagePattern('removeInterest')
  remove(@Payload() id: string) {
    return this.interestService.remove(id);
  }
}
