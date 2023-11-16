import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IdeaNeedEnum, IdeaTypeEnum } from '../../utils/constants';
import { AmountWithCurrency } from '@app/shared/utils/amount-with-currency.dto';
import { Category } from '../../category/entities/category.entity';
import { FileModel } from '@app/shared/model/file.model';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { Share } from './share.entity';

@Entity()
export class Idea extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  accepted: boolean;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    default: false,
  })
  spotlight: boolean;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  media: FileModel[];

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  collaborators: string[];

  @Column({
    type: 'enum',
    enum: IdeaTypeEnum,
    default: IdeaTypeEnum.FREE,
  })
  ideaType: IdeaTypeEnum;

  @Column({
    type: 'enum',
    enum: IdeaNeedEnum,
    nullable: true,
  })
  ideaNeed: IdeaNeedEnum;

  @Column({
    nullable: true,
  })
  location: string;

  @Column({
    nullable: true,
  })
  website: string;

  @Column({
    nullable: true,
  })
  role: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  competitors: string[];

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  additionalAttachment: string[];

  @Column({
    type: 'simple-json',
    nullable: true,
  })
  ideaCost: AmountWithCurrency;

  @Column({ nullable: true })
  sellingReason: string;

  @Column({ type: 'simple-json', nullable: true })
  valuation: AmountWithCurrency;

  @Column({ type: 'simple-json', nullable: true })
  estimationCost: AmountWithCurrency;

  @Column({ nullable: true })
  ROITimeline: string;

  @Column({ type: 'simple-json', nullable: true })
  projectedRevenue: AmountWithCurrency;

  @Column({ nullable: true })
  fundingStage: string;

  @Column({ type: 'simple-json', nullable: true })
  totalMoneyRaised: AmountWithCurrency;

  @Column({ type: 'simple-json', nullable: true })
  executionCost: AmountWithCurrency;

  @Column({ nullable: true })
  seeking: string;

  @Column({ nullable: true })
  sharesRating: number;

  @OneToMany(() => Comment, (comment) => comment.idea)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.idea)
  likes: Like[];

  @OneToMany(() => Share, (share) => share.idea)
  shares: Share[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
