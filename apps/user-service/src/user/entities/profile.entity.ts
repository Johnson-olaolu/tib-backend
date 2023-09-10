import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Interest } from '../../interest/entities/interest.entity';

@Entity()
export class Profile extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  profilePicture: string;

  @ManyToMany(() => Interest)
  @JoinColumn({
    referencedColumnName: 'name',
  })
  interests: Interest[];

  @Column()
  bio: string;
}
