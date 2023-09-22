export interface IPaystackResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

export type channel =
  | 'card'
  | 'bank'
  | 'ussd'
  | 'qr'
  | 'mobile_money'
  | 'bank_transfer'
  | 'eft';

export type currency = 'NGN' | 'USD';

export type account_type = 'nuban' | ' mobile_money ' | 'basa';

export interface IInitializeTransactionResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface ITransactionDetails {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: null;
  gateway_response: string;
  paid_at: Date;
  created_at: Date;
  channel: channel;
  currency: currency;
  ip_address: string;
  metadata: string;
  log: object;
  fees: number;
  fees_split: null;
  authorization: object;
  customer: object;
  plan: null;
  split: object;
  order_id: null;
  paidAt: Date;
  createdAt: Date;
  requested_amount: number;
  pos_transaction_data: null;
  source: null;
  fees_breakdown: null;
  transaction_date: Date;
  plan_object: object;
  subaccount: object;
}

export interface IBankDetails {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: null;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: currency;
  type: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRecipientDetails {
  active: boolean;
  createdAt: Date;
  currency: currency;
  domain: string;
  id: 20317609;
  integration: 463433;
  name: string;
  recipient_code: string;
  type: account_type;
  updatedAt: Date;
  is_deleted: false;
  details: {
    authorization_code: null;
    account_number: string;
    account_name: string;
    bank_code: string;
    bank_name: string;
  };
}

export interface ITransferDetails {
  integration: number;
  domain: string;
  amount: number;
  currency: currency;
  reference: string;
  source: 'balance';
  reason: string;
  recipient: string;
  status: string;
  transfer_code: string;
  source_details: null;
  failures: null;
  titan_code: null;
  transferred_at: Date;
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
