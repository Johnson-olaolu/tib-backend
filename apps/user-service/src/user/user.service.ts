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
import { Repository } from 'typeorm';
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
import * as moment from 'moment';
import { ConfirmUserDto } from '@app/shared/dto/user-service/confirm-user.dto';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from '@app/shared/dto/user-service/change-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private profileRepository: Repository<Profile>,
    private planService: PlanService,
    private roleService: RoleService,
    private interestService: InterestService,
    private configService: ConfigService,
    @Inject(RABBITMQ_QUEUES.FILE_SERVICE) private fileClient: ClientProxy,
    @Inject(RABBITMQ_QUEUES.NOTIFICATION_SERVICE)
    private notificationClient: ClientProxy,
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
      const newUser = this.userRepository.create(newUserDetails);
      await this.generateConfirmAccountToken(newUser);
      return newUser;
    } catch (error) {
      if (error?.code == POSTGRES_ERROR_CODES.unique_violation) {
        throw new RpcException(new BadRequestException(error.detail));
      }
      throw new RpcException(new InternalServerErrorException());
    }
  }

  //Handle confirm account
  async generateConfirmAccountToken(user: User) {
    const verificationToken = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      specialChars: false,
      upperCaseAlphabets: false,
    });

    const expire = moment().add(15, 'minutes');

    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenTTL = moment(expire, true).toDate();

    const registrationNotification: INotification<RegistrationNotificationData> =
      {
        type: ['email'],
        data: {
          date: moment().toString(),
          name: user.userName,
          recipientMail: user.email,
          token: verificationToken,
        },
      };
    await firstValueFrom(
      this.notificationClient.emit('userRegistered', registrationNotification),
    );
    await user.save();
  }

  async generateNewConfirmAccountToken(userId: string) {
    const user = await this.findOne(userId);
    this.generateConfirmAccountToken(user);
  }

  async confirmNewUser(confirmUserDto: ConfirmUserDto) {
    const user = await this.findOne(confirmUserDto.userId);
    const currentDate = moment.now();

    if (currentDate > moment(user.emailVerificationTokenTTL).valueOf()) {
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
    user.passwordResetTokenTTL = moment(expire, true).toDate();

    const passwordResetUrl = `${this.configService.get(
      'CLIENT_URL',
    )}/auth/reset-password?email=${user.email}&token=${
      user.passwordResetToken
    }`;

    const passwordResetNotification: INotification<PasswordResetNotificationData> =
      {
        type: ['email'],
        data: {
          recipientMail: user.email,
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
    const currentDate = moment.now();

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

  //handle profile updates
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

  async remove(id: string) {
    const deleteResponse = await this.userRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RpcException(
        new NotFoundException('User not found for this ID'),
      );
    }
  }
}
