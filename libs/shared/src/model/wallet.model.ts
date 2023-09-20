import { TransactionModel } from './transaction.model';

export class WalletModel {
  id: string;

  userId: string;

  amount: number;

  transactions: TransactionModel[];

  public createdAt: Date;

  public updatedAt: Date;
}
