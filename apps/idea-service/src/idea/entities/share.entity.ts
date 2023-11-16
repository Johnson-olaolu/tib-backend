import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Idea } from '../../idea/entities/idea.entity';
import { LIkeTypeEnum } from '../../utils/constants';

@Entity()
export class Share extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => Comment, {
    nullable: true,
  })
  comment: Comment;

  @ManyToOne(() => Idea, {
    nullable: true,
  })
  idea: Idea;

  @Column({
    type: 'enum',
    enum: LIkeTypeEnum,
  })
  type: LIkeTypeEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
