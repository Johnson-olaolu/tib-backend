import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';
import { Idea } from '../../idea/entities/idea.entity';
import { LIkeTypeEnum } from '../../utils/constants';
import { Like } from './like.entity';
import { Share } from './share.entity';

@Entity()
@Tree('closure-table')
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  comment: string;

  @ManyToOne(() => Idea)
  idea: Idea;

  @Column({
    type: 'enum',
    enum: LIkeTypeEnum,
  })
  type: LIkeTypeEnum;

  @TreeParent()
  parent: Comment;

  @TreeChildren()
  children: Comment[];

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @OneToMany(() => Share, (share) => share.comment)
  shares: Share[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
