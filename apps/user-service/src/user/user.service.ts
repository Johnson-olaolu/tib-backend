import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { BCRYPT_HASH_ROUND } from '../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { PlanService } from '../plan/plan.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private planService: PlanService,
    private roleService: RoleService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const hashedPass = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_HASH_ROUND,
    );
    const role = await this.roleService.findOneByName(createUserDto.role);
    const plan = await this.planService.findOneByName(createUserDto.plan);
    const newUserDetails = {
      ...createUserDto,
      password: hashedPass,
      role: role,
      plan: plan,
    };
    try {
      const newUser = await this.userRepository.save(newUserDetails);
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('User not Found for this ID');
    }
    return user;
  }

  async findOneByEmailOrUserName(userNameOrEmail: string) {
    const user = await this.userRepository.findOne({
      where: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });
    if (!user) {
      throw new NotFoundException('User not Found for this ID');
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException('User not found for this ID');
    }
  }
}
