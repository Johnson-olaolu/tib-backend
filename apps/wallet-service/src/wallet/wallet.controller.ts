import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from '../../../../libs/shared/src/dto/wallet/create-wallet.dto';

@Controller()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @MessagePattern('createWallet')
  create(@Payload() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @MessagePattern('findAllWallet')
  findAll() {
    return this.walletService.findAll();
  }

  // @MessagePattern('getWalletDetails')
  // getWalletDetails(@Payload() id: string) {
  //   return this.walletService.findOne(id);
  // }

  @MessagePattern('removeWallet')
  remove(@Payload() id: string) {
    return this.walletService.remove(id);
  }
}
