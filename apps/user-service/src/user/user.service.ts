import {
  BadRequestException,
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
import { ValidateUserDto } from '@app/shared/dto/user-service/validate-user.dto';
import { RpcException } from '@nestjs/microservices';
import { POSTGRES_ERROR_CODES } from '@app/shared/utils/constants';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { InterestService } from '../interest/interest.service';
import { Interest } from '../interest/entities/interest.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private planService: PlanService,
    private roleService: RoleService,
    private interestService: InterestService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPass = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_HASH_ROUND,
    );
    const role = await this.roleService.findOneByName(createUserDto.role);
    const plan = await this.planService.findOneByName(createUserDto.plan);
    const profile = await this.profileRepository.save({});
    const newUserDetails = {
      ...createUserDto,
      password: hashedPass,
      role: role,
      plan: plan,
      profile: profile,
    };
    try {
      const newUser = await this.userRepository.save(newUserDetails);
      return newUser;
    } catch (error) {
      if (error?.code == POSTGRES_ERROR_CODES.unique_violation) {
        throw new RpcException(new BadRequestException(error.detail));
      }
      throw new RpcException(new InternalServerErrorException());
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new RpcException(
        new NotFoundException('User not Found for this ID'),
      );
    }
    return user;
  }

  async getUserDetails(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
    if (!user) {
      throw new RpcException(
        new NotFoundException('User not Found for this ID'),
      );
    }
    return user;
  }

  async findOneByEmailOrUserName(userNameOrEmail: string) {
    const user = await this.userRepository.findOne({
      where: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
    });
    if (!user) {
      throw new RpcException(
        new NotFoundException('User not Found for this ID'),
      );
    }
    return user;
  }

  async validateUser(validateUserDto: ValidateUserDto) {
    const user = await this.findOneByEmailOrUserName(
      validateUserDto.usernameOrEmail,
    );
    const passwordMatched = await user.comparePasswords(
      validateUserDto.password,
    );
    console.log(passwordMatched);
    if (passwordMatched) {
      return user;
    } else {
      throw new RpcException(
        new BadRequestException('Wrong Password Provided'),
      );
    }
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.getUserDetails(userId);
    const profile = await this.profileRepository.findOne({
      where: {
        id: user.profile.id,
      },
    });
    const interests: Interest[] = [];
    for (const selectedInterest of updateProfileDto.interests) {
      const interest = await this.interestService.findOneByName(
        selectedInterest,
      );
      interests.push(interest);
    }
    const profileDetails: Partial<Profile> = {
      firstName: updateProfileDto.firstName,
      lastName: updateProfileDto.lastName,
      bio: updateProfileDto.bio,
      interests: interests,
    };
    for (const detail in profileDetails) {
      profile[detail] = profileDetails[detail];
    }
    await profile.save();
    return profile;
  }

  async remove(id: string) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RpcException(
        new NotFoundException('User not found for this ID'),
      );
    }
  }
}
