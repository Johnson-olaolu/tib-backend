import { AddPaymentMethodDto } from '@app/shared/dto/wallet/add-payment-method.dto';
import { OmitType } from '@nestjs/mapped-types';

export class UpdateWalletPaymentMethodFieldDto extends AddPaymentMethodDto {}

export class UpdateWalletPaymentMethodDefaultDto extends OmitType(
  AddPaymentMethodDto,
  ['fields'],
) {}
