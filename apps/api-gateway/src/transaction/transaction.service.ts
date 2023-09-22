import { ConfirmCreditWalletDto } from '@app/shared/dto/wallet/credit-wallet.dto';
import { TransactionModel } from '@app/shared/model/transaction.model';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(RABBITMQ_QUEUES.WALLET_SERVICE) private walletClient: ClientProxy,
  ) {}

  async verifyCreditTransactionPaystack(reference: string) {
    const transaction = await lastValueFrom(
      this.walletClient.send<TransactionModel>(
        'verifyCreditTransactionPaystack',
        reference,
      ),
    );
    if (transaction.status === 'success') {
      const confirmCreditWalletDto: ConfirmCreditWalletDto = {
        amount: transaction.amount,
        transactionId: transaction.id,
        walletId: transaction.wallet,
      };
      await firstValueFrom(
        this.walletClient.emit('creditWallet', confirmCreditWalletDto),
      );
      return 'transaction successfull';
    }
    return 'Transaction Processed';
  }
}
