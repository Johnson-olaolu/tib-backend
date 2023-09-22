import { WalletModel } from './wallet.model';

export class TransactionModel {
  id: string;

  wallet: WalletModel;

  amount: number;

  currency: string;

  paymentMethod: string;

  type: string;

  status: string;

  progress: string;

  reference: string;

  paystackTransactionId: string;

  paystackTransactionUrl: string;

  createdAt: Date;

  updatedAt: Date;
}
