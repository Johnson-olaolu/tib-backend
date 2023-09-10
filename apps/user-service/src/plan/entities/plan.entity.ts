import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanTypeEnum } from '../../utils/constants';

@Entity()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: PlanTypeEnum,
    default: PlanTypeEnum.FREE,
  })
  type: PlanTypeEnum;

  @Column({
    default: 0,
  })
  price: number;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
