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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
