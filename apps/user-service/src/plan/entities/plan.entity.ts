import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanTypeEnum } from '../../utils/constants';
import { PlanPermision } from '../../plan-permission/entities/plan-permission.entity';

@Entity()
export class Plan extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column()
  description: string;

  @Column({
    type: 'enum',
    enum: PlanTypeEnum,
    default: PlanTypeEnum.FREE,
  })
  type: PlanTypeEnum;

  @ManyToMany(() => PlanPermision)
  @JoinTable()
  planPermissions: PlanPermision[];

  @Column({
    default: 0,
  })
  price: number;

  @Column({
    default: true,
  })
  active: boolean;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
