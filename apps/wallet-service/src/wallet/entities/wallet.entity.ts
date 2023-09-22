import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletPaymentMethod } from './wallet-payment-method.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { ColumnNumericTransformer } from '@app/shared/utils/misc';

@Entity()
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  userId: string;

  @Column({
    type: 'decimal',
    default: 0,
    transformer: new ColumnNumericTransformer(),
  })
  balance: number;

  @OneToMany(() => WalletTransaction, (transaction) => transaction.wallet)
  transactions: WalletTransaction[];

  @OneToMany(() => WalletPaymentMethod, (paymentMethod) => paymentMethod.wallet)
  paymentMethods: WalletPaymentMethod[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
