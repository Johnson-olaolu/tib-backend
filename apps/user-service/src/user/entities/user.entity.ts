import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Profile } from './profile.entity';
import { Role } from '../../role/entities/role.entity';
import { Plan } from '../../plan/entities/plan.entity';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Follow } from './follow.entity';
import { Block } from './block.entity';
import { Report } from './report.entity';

@Entity({
  name: '_user',
})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  userName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  emailVerificationToken: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  emailVerificationTokenTTL: Date;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  passwordResetToken: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    nullable: true,
  })
  passwordResetTokenTTL: Date;

  @Column({
    default: false,
  })
  isEmailVerified: boolean;

  @OneToOne(() => Profile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleName', referencedColumnName: 'name' })
  role: Role;

  @Column()
  roleName: string;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'planName', referencedColumnName: 'name' })
  plan: Plan;

  @Column()
  planName: string;

  @ManyToOne(() => Follow, (follow) => follow.user, {
    onDelete: 'CASCADE',
  })
  followers: Follow[];

  @ManyToOne(() => Follow, (follow) => follow.follower, {
    onDelete: 'CASCADE',
  })
  following: Follow[];

  @ManyToOne(() => Block, (block) => block.blocked, {
    onDelete: 'CASCADE',
  })
  blocked: Block[];

  @ManyToOne(() => Block, (block) => block.user, {
    onDelete: 'CASCADE',
  })
  blocks: Block[];

  @ManyToOne(() => Report, (report) => report.user, {
    onDelete: 'CASCADE',
  })
  reported: Report[];

  @ManyToOne(() => Report, (report) => report.reporter, {
    onDelete: 'CASCADE',
  })
  reports: Report[];

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;

  async comparePasswords(password: string): Promise<boolean> {
    const result = await bcrypt.compareSync(password, this.password);
    return result;
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
