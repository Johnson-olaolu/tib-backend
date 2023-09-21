export class TransactionModel {
  id: string;

  wallet: string;

  amount: number;

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
