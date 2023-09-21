import { TransactionModel } from './transaction.model';

export class WalletTransactionModel {
  id: string;

  action: string;

  type: string;

  amount: number;

  currency: string;

  description: string;

  prevBalance: number;

  currBalance: number;

  wallet: string;

  transactionReference: string;

  transaction: TransactionModel;

  createdAt: Date;

  updatedAt: Date;
}
