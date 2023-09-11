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

  @Column({ select: false })
  password?: string;

  @Column({
    nullable: true,
  })
  emailVerificationToken: string;

  @Column({
    nullable: true,
  })
  passwordVerificationToken: string;

  @Column({
    default: false,
  })
  isEmailVerified: boolean;

  @OneToOne(() => Profile, {
    onDelete: 'CASCADE',
  })
  profile: Profile;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role', referencedColumnName: 'name' })
  role: Role;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan', referencedColumnName: 'name' })
  plan: Plan;

  async comparePasswords(password: string): Promise<boolean> {
    const result = await bcrypt.compareSync(password, this.password);
    return result;
  }

  @CreateDateColumn()
  public createdAt: Date;

  @UpdateDateColumn()
  public updatedAt: Date;
}
