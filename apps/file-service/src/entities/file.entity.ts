import { FileTypeEnum } from '@app/shared/utils/constants';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  path: string;

  @Column()
  author: string;

  @Column()
  ownerId: string;

  @Column({
    unique: true,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: FileTypeEnum,
  })
  type: FileTypeEnum;

  @Column()
  mimeType: string;

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
