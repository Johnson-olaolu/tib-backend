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
import { ColumnNumericTransformer } from '@app/shared/utils/misc';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class Transaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Wallet)
  @JoinColumn()
  wallet: Wallet;

  @Column({ type: 'decimal', transformer: new ColumnNumericTransformer() })
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
