import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { WalletTransaction } from '../../wallet/entities/wallet-transaction.entity';
import { PaymentMethod } from '../../payment-method/entities/payment-method.entity';
import {
  TransactionProgressEnum,
  TransactionTypeEnum,
} from '../../utils/constants';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => WalletTransaction, {
    nullable: true,
  })
  wallet: WalletTransaction;

  @Column({ type: 'decimal' })
  amount: number;

  @Column({
    nullable: true,
  })
  currency: string;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ referencedColumnName: 'name' })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
  })
  type: TransactionTypeEnum;

  @Column({
    nullable: true,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: TransactionProgressEnum,
    default: TransactionProgressEnum.STARTED,
  })
  progress: TransactionProgressEnum;

  @Column()
  reference: string;

  @Column({
    nullable: true,
  })
  paystackTransactionId: string;

  @Column({
    nullable: true,
  })
  paystackTransactionUrl: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
