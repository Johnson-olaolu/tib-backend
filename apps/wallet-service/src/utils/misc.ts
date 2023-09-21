import * as moment from 'moment';
import * as uniqid from 'uniqid';
import { WalletTransactionActionEnum } from './constants';

export function generateReference(type: WalletTransactionActionEnum) {
  const presentDate = moment().format('YYYYMMDD');
  const paymentReference = uniqid(`TIB_${type}-`, `-${presentDate}`);
  return paymentReference;
}
