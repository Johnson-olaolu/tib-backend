import { CreatePaymentMethodDto } from '@app/shared/dto/wallet/create-payment-method.dto';

export interface IDefaultPaymentMethod {
  name: string;
  image: string;
  fields: string[];
  disabled?: boolean;
}

export const defaultPaymentMethods: IDefaultPaymentMethod[] = [
  {
    name: 'Card',
    image: 'paymentCardLogo.png',
    fields: ['cardName', 'cardNumber', 'expiryDate', 'cvv'],
  },
  {
    name: 'Bank',
    image: 'paymentBankLogo.png',
    fields: [],
  },
  {
    name: 'Bitcoin',
    image: 'paymentBitcoinLogo.png',
    fields: [],
    disabled: true,
  },
  {
    name: 'Paypal',
    image: 'paymentPaypalLogo.png',
    fields: [],
    disabled: true,
  },
];

export enum WalletTransactionActionEnum {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
}

export enum TransactionTypeEnum {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TransactionProgressEnum {
  STARTED = 'STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}
