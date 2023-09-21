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
  })
  amount: number;

  @OneToMany(() => WalletTransaction, (transaction) => transaction.wallet)
  transactions: WalletTransaction[];

  @OneToMany(() => WalletPaymentMethod, (paymentMethod) => paymentMethod.wallet)
  paymentMethods: WalletPaymentMethod[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
