import { PartialType } from '@nestjs/mapped-types';
import { CreateWalletDto } from '../../../../../libs/shared/src/dto/wallet/create-wallet.dto';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  id: number;
}
