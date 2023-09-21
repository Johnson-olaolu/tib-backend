import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';

@Entity()
export class WalletPaymentMethod extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet)
  wallet: Wallet;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ referencedColumnName: 'name' })
  paymentMethod: PaymentMethod;

  @Column({
    nullable: true,
  })
  defaultFields: string;

  @Column({
    default: false,
  })
  isDefault: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
