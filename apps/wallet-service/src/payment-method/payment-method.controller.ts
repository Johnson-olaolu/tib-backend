import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaymentMethodService } from './payment-method.service';
import { CreatePaymentMethodDto } from '../../../../libs/shared/src/dto/wallet/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Controller()
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @MessagePattern('createPaymentMethod')
  async create(@Payload() createPaymentMethodDto: CreatePaymentMethodDto) {
    return await this.paymentMethodService.create(createPaymentMethodDto);
  }

  @MessagePattern('findAllPaymentMethod')
  async findAll() {
    return await this.paymentMethodService.findAll();
  }

  @MessagePattern('findOnePaymentMethod')
  async findOne(@Payload() id: string) {
    return await this.paymentMethodService.findOne(id);
  }

  @MessagePattern('updatePaymentMethod')
  async update(@Payload() updatePaymentMethodDto: UpdatePaymentMethodDto) {
    return await this.paymentMethodService.update(
      updatePaymentMethodDto.id,
      updatePaymentMethodDto,
    );
  }

  @MessagePattern('removePaymentMethod')
  remove(@Payload() id: string) {
    return this.paymentMethodService.remove(id);
  }
}
