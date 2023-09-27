import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Idea extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  decription: string;

  @Column({
    type: 'simple-array',
  })
  categories: string[];

  @Column({
    type: 'simple-array',
  })
  media: string[];

  @Column({
    type: 'simple-array',
  })
  collaborators: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
