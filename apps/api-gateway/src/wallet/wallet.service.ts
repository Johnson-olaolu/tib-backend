import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CreditWalletDto } from './dto/credit-wallet.dto';
import { InitiateCreditWalletDto } from '@app/shared/dto/wallet/credit-wallet.dto';
import { lastValueFrom } from 'rxjs';
import { TransactionModel } from '@app/shared/model/transaction.model';
import { WalletModel } from '@app/shared/model/wallet.model';
import { DebitWalletDto } from './dto/debit-wallet.dto';
import { InitiateDebitWalletDto } from '@app/shared/dto/wallet/debit-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @Inject(RABBITMQ_QUEUES.WALLET_SERVICE) private walletClient: ClientProxy,
  ) {}

  async getWalletDetails(walletId: string) {
    try {
      const response = await lastValueFrom(
        this.walletClient.send<WalletModel>('getWalletDetails', walletId),
      );
      return response;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  async initiateCredit(walletId: string, creditWalletDto: CreditWalletDto) {
    try {
      const initiateCreditWalletDto: InitiateCreditWalletDto = {
        walletId,
        ...creditWalletDto,
      };
      const response = await lastValueFrom(
        this.walletClient.send<TransactionModel>(
          'initiateCredit',
          initiateCreditWalletDto,
        ),
      );
      return response;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  async initiateDebit(walletId: string, debitWalletDto: DebitWalletDto) {
    try {
      const initiateDebitWalletDto: InitiateDebitWalletDto = {
        walletId,
        ...debitWalletDto,
      };
      const response = await lastValueFrom(
        this.walletClient.send<TransactionModel>(
          'initiateDebit',
          initiateDebitWalletDto,
        ),
      );
      return response;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }
}
