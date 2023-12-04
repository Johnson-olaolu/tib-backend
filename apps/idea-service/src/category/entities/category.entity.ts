import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Idea } from '../../idea/entities/idea.entity';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    default: false,
  })
  isTopCategory: boolean;

  //make sure to remove null in production
  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  profilePicture: string;

  @Column({
    nullable: true,
  })
  backgroundPicture: string;

  @ManyToMany(() => Idea)
  ideas: Idea[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
