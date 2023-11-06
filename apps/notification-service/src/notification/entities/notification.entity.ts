import { NotificationEventTypes } from '@app/shared/utils/constants';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Notification extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  eventType: NotificationEventTypes;

  @Column()
  userId: string;

  @Column({
    default: false,
  })
  seen: boolean;

  @Column({
    type: 'simple-json',
  })
  data: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
