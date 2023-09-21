import { WalletTransactionModel } from './wallet-transaction.model';

export class WalletModel {
  id: string;

  userId: string;

  amount: number;

  transactions: WalletTransactionModel[];

  public createdAt: Date;

  public updatedAt: Date;
}
