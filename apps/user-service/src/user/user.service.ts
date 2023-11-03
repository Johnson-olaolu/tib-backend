import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from '@app/shared/dto/user-service/create-user.dto';
import * as bcrypt from 'bcryptjs';
import * as otpGenerator from 'otp-generator';
import { BCRYPT_HASH_ROUND } from '../utils/constants';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, ILike, Repository } from 'typeorm';
import { RoleService } from '../role/role.service';
import { PlanService } from '../plan/plan.service';
import { ValidateUserDto } from '@app/shared/dto/user-service/validate-user.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import {
  FileTypeEnum,
  POSTGRES_ERROR_CODES,
  RABBITMQ_QUEUES,
} from '@app/shared/utils/constants';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { InterestService } from '../interest/interest.service';
import { Interest } from '../interest/entities/interest.entity';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { FileModel } from '@app/shared/model/file.model';
import { GetFileDto } from '@app/shared/dto/file/get-file.dto';
import {
  INotification,
  PasswordResetNotificationData,
  RegistrationNotificationData,
} from '@app/shared/dto/notification/notificationTypes';
import * as moment from 'moment-timezone';
import { ConfirmUserDto } from '@app/shared/dto/user-service/confirm-user.dto';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from '@app/shared/dto/user-service/change-password.dto';
import { WalletModel } from '@app/shared/model/wallet.model';
import { CreateWalletDto } from '@app/shared/dto/wallet/create-wallet.dto';
import { Role } from '../role/entities/role.entity';
import { Plan } from '../plan/entities/plan.entity';
import { UpgradePlanDto } from '@app/shared/dto/user-service/upgrade-plan.dto';
import { ServicePaymentDto } from '@app/shared/dto/wallet/service-payment.dto';
import { QueryUserDto } from '@app/shared/dto/user-service/query-user.dto';

@Injectable()
export class UserService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private planService: PlanService,
    private roleService: RoleService,
    private interestService: InterestService,
    private configService: ConfigService,
    @Inject(RABBITMQ_QUEUES.FILE_SERVICE) private fileClient: ClientProxy,
    @Inject(RABBITMQ_QUEUES.NOTIFICATION_SERVICE)
    private notificationClient: ClientProxy,
    @Inject(RABBITMQ_QUEUES.WALLET_SERVICE)
    private walletClient: ClientProxy,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    const hashedPass = await bcrypt.hash(
      createUserDto.password,
      BCRYPT_HASH_ROUND,
    );
    let role: Role;
    let plan: Plan;
    if (createUserDto.role) {
      role = await this.roleService.findOneByName(createUserDto.role);
    } else {
      role = await this.roleService.findOneByName('user');
    }

    if (createUserDto.plan) {
      plan = await this.planService.findOneByName(createUserDto.plan);
    } else {
      plan = await this.planService.findOneByName('Free');
    }
    const profile = await this.profileRepository.save({});
    const newUserDetails = {
      ...createUserDto,
      password: hashedPass,
      role: role,
      plan: plan,
      profile: profile,
    };
    try {
      const newUser = this.userRepository.create(newUserDetails);
      const user = await this.generateConfirmUserEmailToken(newUser);
      await queryRunner.manager.save(user);
      const createWalletDto: CreateWalletDto = {
        userId: user.id,
      };
      const wallet = await lastValueFrom(
        this.walletClient.send<WalletModel>('createWallet', createWalletDto),
      );
      await queryRunner.commitTransaction();
      return { ...newUser, wallet };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error?.code == POSTGRES_ERROR_CODES.unique_violation) {
        throw new RpcException(new BadRequestException(error.detail));
      }
      throw new RpcException(new InternalServerErrorException());
    } finally {
      await queryRunner.release();
    }
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
        profile: {
          interests: true,
        },
      },
    });
    if (!user) {
      throw new RpcException(
        new NotFoundException('User not Found for this ID'),
      );
    }
    return user;
  }

  //Handle confirm account
  async generateConfirmUserEmailToken(user: User) {
    const verificationToken = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const expire = moment().add(15, 'minutes');
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenTTL = expire.toDate();
    const registrationNotification: INotification<RegistrationNotificationData> =
      {
        type: ['email'],
        recipient: {
          mail: user.email,
          name: user.userName,
        },
        data: {
          date: moment().toString(),
          name: user.userName,
          token: verificationToken,
        },
      };
    await firstValueFrom(
      this.notificationClient.emit('userRegistered', registrationNotification),
    );
    return user;
  }

  async generateNewConfirmUserEmailToken(userId: string) {
    const user = await this.findOne(userId);
    this.generateConfirmUserEmailToken(user);
    await user.save();
  }

  async confirmUserEmail(confirmUserDto: ConfirmUserDto) {
    const user = await this.findOne(confirmUserDto.userId);
    const currentDate = moment(moment.now()).toDate().valueOf();

    if (
      currentDate > moment(user.emailVerificationTokenTTL).toDate().valueOf()
    ) {
      throw new RpcException(new UnauthorizedException('Token Expired'));
    }
    if (confirmUserDto.token !== user.emailVerificationToken) {
      throw new RpcException(new UnauthorizedException('Invalid Token'));
    }
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenTTL = null;
    await user.save();
    return user;
  }

  //Handle Password change
  async generatePasswordResetLink(email: string) {
    const user = await this.findOneByEmailOrUserName(email);
    await this.generatePasswordResetToken(user);
  }

  async generatePasswordResetToken(user: User) {
    const passwordResetToken = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const expire = moment().add(15, 'minutes');

    user.passwordResetToken = passwordResetToken;
    user.passwordResetTokenTTL = moment(expire, true)
      .tz('Africa/Lagos')
      .toDate();

    const passwordResetUrl = `${this.configService.get(
      'CLIENT_URL',
    )}/auth/reset-password?email=${user.email}&token=${
      user.passwordResetToken
    }`;

    const passwordResetNotification: INotification<PasswordResetNotificationData> =
      {
        type: ['email'],
        recipient: {
          mail: user.email,
          name: user.userName,
        },
        data: {
          url: passwordResetUrl,
        },
      };
    await firstValueFrom(
      this.notificationClient.emit('passwordReset', passwordResetNotification),
    );
    await user.save();
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.findOneByEmailOrUserName(changePasswordDto.email);
    const currentDate = moment(moment.now()).toDate().valueOf();

    if (currentDate > moment(user.passwordResetTokenTTL).valueOf()) {
      throw new RpcException(new UnauthorizedException('Token Expired'));
    }
    if (changePasswordDto.token !== user.passwordResetToken) {
      throw new RpcException(new UnauthorizedException('Invalid Token'));
    }

    const hashedPass = await bcrypt.hash(
      changePasswordDto.password,
      BCRYPT_HASH_ROUND,
    );
    user.password = hashedPass;
    user.passwordResetToken = null;
    user.passwordResetTokenTTL = null;
    await user.save();
    return user;
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async query(query: QueryUserDto) {
    const users = await this.userRepository.find({
      where: [
        { planName: query.plan, roleName: 'user', isEmailVerified: true },
        { email: query.email, roleName: 'user', isEmailVerified: true },
        {
          userName: ILike(`%${query.email}%`),
          roleName: 'user',
          isEmailVerified: true,
        },
        {
          profile: { firstName: ILike(`%${query.name}%`) },
          roleName: 'user',
          isEmailVerified: true,
        },
        {
          profile: { lastName: ILike(`%${query.name}%`) },
          roleName: 'user',
          isEmailVerified: true,
        },
        {
          profile: { phoneNumber: ILike(`%${query.phoneNumber}%`) },
          roleName: 'user',
          isEmailVerified: true,
        },
      ],
      relations: {
        profile: true,
      },
    });
    return users;
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
    if (passwordMatched) {
      return user;
    } else {
      throw new RpcException(
        new BadRequestException('Wrong Password Provided'),
      );
    }
  }

  //handle profile updates
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const profileDetails = updateProfileDto;
    console.log({ userId });
    const user = await this.getUserDetails(userId);
    console.log({ user });
    const profile = await this.profileRepository.findOne({
      where: {
        id: user.profile.id,
      },
    });
    if (updateProfileDto.interests) {
      const interests: Interest[] = [];
      for (const selectedInterest of profileDetails.interests) {
        const interest = await this.interestService.findOneByName(
          selectedInterest,
        );
        interests.push(interest);
      }
      profile.interests = interests;
      delete profileDetails.interests;
    }
    for (const detail in profileDetails) {
      profile[detail] = profileDetails[detail];
    }
    await profile.save();
    // console.log(profile);
    return profile;
  }

  async updateProfilePicture(userId: string, file: Express.Multer.File) {
    const user = await this.getUserDetails(userId);
    const profile = await this.profileRepository.findOne({
      where: {
        id: user.profile.id,
      },
    });
    const fileName = user.userName + '_' + 'profile_pic';

    const fileDetails: SaveFileDto = {
      author: user.id,
      name: fileName,
      file: file,
      mimetype: file.mimetype,
      parent: user.id,
      type: FileTypeEnum.PROFILE,
    };

    let savedFile: FileModel;

    try {
      await lastValueFrom(
        this.fileClient.send<FileModel>('getFile', { title: fileName }),
      );
      savedFile = await lastValueFrom(
        this.fileClient.send<FileModel>('updateFile', fileDetails),
      );
    } catch (error) {
      savedFile = await lastValueFrom(
        this.fileClient.send<FileModel>('saveFile', fileDetails),
      );
    }

    profile.profilePicture = savedFile.path;
    await profile.save();
    return profile;
  }

  //handle plans
  async upgradeUserPlan(upgradePlanDto: UpgradePlanDto) {
    const user = await this.findOne(upgradePlanDto.userId);
    if (user.planName === upgradePlanDto.plan) {
      throw new RpcException(
        new BadRequestException('User Already subscribed to plan'),
      );
    }
    const plan = await this.planService.findOneByName(upgradePlanDto.plan);
    const servicePaymentDto: ServicePaymentDto = {
      amount: plan.price,
      plan: upgradePlanDto.plan,
      userId: user.id,
    };
    await lastValueFrom(
      this.walletClient.send<WalletModel>('servicePayment', servicePaymentDto),
    );
    user.plan = plan;
    await user.save();
    return user;
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
