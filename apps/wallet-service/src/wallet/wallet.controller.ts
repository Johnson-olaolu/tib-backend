import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from '../../../../libs/shared/src/dto/wallet/create-wallet.dto';
import {
  ConfirmCreditWalletDto,
  InitiateCreditWalletDto,
} from '@app/shared/dto/wallet/credit-wallet.dto';

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

  @MessagePattern('getWalletDetails')
  async getWalletDetails(@Payload() id: string) {
    return await this.walletService.findOne(id);
  }

  @MessagePattern('getUserWalletDetails')
  async getUserWalletDetails(@Payload() userId: string) {
    return await this.walletService.getUserWalletDetails(userId);
  }

  @MessagePattern('removeWallet')
  remove(@Payload() id: string) {
    return this.walletService.remove(id);
  }

  @MessagePattern('initiateCredit')
  async initiateCredit(
    @Payload() initiateCreditWalletDto: InitiateCreditWalletDto,
  ) {
    return await this.walletService.initiateCredit(initiateCreditWalletDto);
  }

  @EventPattern('creditWallet')
  async creditWallet(
    @Payload() confirmCreditWalletDto: ConfirmCreditWalletDto,
  ) {
    return await this.walletService.confirmCredit(confirmCreditWalletDto);
  }
}
