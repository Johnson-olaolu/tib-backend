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
import { Wallet } from './wallet.entity';
import {
  TransactionTypeEnum,
  WalletTransactionActionEnum,
} from '../../utils/constants';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { ColumnNumericTransformer } from '@app/shared/utils/misc';

@Entity()
export class WalletTransaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({
    type: 'enum',
    enum: WalletTransactionActionEnum,
  })
  public action: WalletTransactionActionEnum;

  @Column({
    type: 'enum',
    enum: TransactionTypeEnum,
  })
  public type: TransactionTypeEnum;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
  })
  public amount: number;

  @Column({
    default: 'NGN',
  })
  public currency: string;

  @Column()
  public description: string;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  public prevBalance: number;

  @Column({
    type: 'decimal',
    transformer: new ColumnNumericTransformer(),
    default: 0,
  })
  public currBalance: number;

  @Column({
    nullable: true,
  })
  public recipient: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  public wallet: Wallet;

  @Column()
  public transactionReference: string;

  @OneToOne(() => Transaction, {
    nullable: true,
  })
  @JoinColumn()
  transaction: Transaction;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
