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
  @JoinColumn({ name: 'role', referencedColumnName: 'name' })
  role: Role;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan', referencedColumnName: 'name' })
  plan: Plan;

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
