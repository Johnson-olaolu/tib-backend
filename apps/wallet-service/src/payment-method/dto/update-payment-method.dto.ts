import { PartialType } from '@nestjs/mapped-types';
import { CreatePaymentMethodDto } from '../../../../../libs/shared/src/dto/wallet/create-payment-method.dto';

export class UpdatePaymentMethodDto extends PartialType(
  CreatePaymentMethodDto,
) {
  id: string;
}
