import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Block } from './entities/block.entity';
import { Follow } from './entities/follow.entity';
import { Profile } from './entities/profile.entity';
import { RoleModule } from '../role/role.module';
import { Report } from './entities/report.entity';
import { PlanModule } from '../plan/plan.module';
import { InterestModule } from '../interest/interest.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Block, Follow, Profile, Report]),
    RoleModule,
    PlanModule,
    InterestModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
