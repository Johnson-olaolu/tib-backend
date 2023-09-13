import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RABBITMQ_QUEUES } from '../utils/constants';
import { UserModel } from '../user/model/user.model';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
@Injectable()
export class AuthService {
  constructor(
    @Inject(RABBITMQ_QUEUES.USER_SERVICE)
    private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async registerNewUser(registerUserDto: RegisterDto) {
    try {
      const newUser = await lastValueFrom(
        this.userClient.send<UserModel>('createUser', registerUserDto),
      );
      // await this.generateConfirmAccountToken(newUser.email);
      return this.loginUser({
        ...newUser,
        role: (newUser.role as any)?.name,
        plan: (newUser.plan as any)?.name,
      });
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  async getUser(usernameOrEmail: string) {
    const user = await lastValueFrom(
      this.userClient.send<UserModel>(
        'findOneUserByEmailOrUserName',
        usernameOrEmail,
      ),
    );
    return user;
  }

  loginUser(user: UserModel) {
    const payload = { username: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: accessToken,
    };
  }

  public async getAuthenticatedUser(usernameOrEmail: string, password: string) {
    try {
      const user = await lastValueFrom(
        this.userClient.send<UserModel>('validateUser', {
          usernameOrEmail,
          password,
        }),
      );
      return user;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  // async generateConfirmAccountToken(email: string) {
  //   const user = await this.userService.findUserByEmail(email);
  //   const verificationToken = otpGenerator.generate(6, {
  //     digits: true,
  //     lowerCaseAlphabets: false,
  //     specialChars: false,
  //     upperCaseAlphabets: false,
  //   });

  //   const expire = moment().add(15, 'minutes');

  //   user.confirmUserToken = verificationToken;
  //   user.tokenTimeToLive = moment(expire, true).toDate();
  //   await user.save();
  //   await this.mailService.sendUserConfirmationMail(user);
  // }

  // async confirmNewUser(confirmUsertDto: ConfimUserDto) {
  //   const { email, token } = confirmUsertDto;
  //   const user = await this.userService.findUserByEmail(email);
  //   const currentDate = moment().valueOf();

  //   console.log({
  //     currentDate,
  //     today: moment(),
  //     time: user.tokenTimeToLive,
  //     ttl: moment(user.tokenTimeToLive).valueOf(),
  //   });
  //   if (currentDate > moment(user.tokenTimeToLive).valueOf()) {
  //     throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
  //   }
  //   if (token !== user.confirmUserToken) {
  //     throw new HttpException('Token Doesnt Match', HttpStatus.UNAUTHORIZED);
  //   }
  //   user.isVerified = true;
  //   user.confirmUserToken = null;
  //   user.tokenTimeToLive = null;
  //   await user.save();
  // }

  // async getPasswordResetLink(email: string) {
  //   const user = await this.userService.findUserByEmail(email);
  //   const resetPasswordToken = otpGenerator.generate(6, {
  //     digits: true,
  //     lowerCaseAlphabets: false,
  //     specialChars: false,
  //     upperCaseAlphabets: false,
  //   });

  //   const expire = moment().add(15, 'minutes').format('YYYY-MM-DD hh:mm:ss');

  //   user.resetPasswordToken = resetPasswordToken;
  //   user.tokenTimeToLive = new Date(expire);

  //   await user.save();
  //   await this.mailService.sendChangePasswordMail(user);
  // }

  // async confirmNewPassword(changePasswordDto: ChangePasswordDto) {
  //   const { email, token, password } = changePasswordDto;
  //   const user = await this.userService.findUserByEmail(email);
  //   const currentDate = moment().valueOf();

  //   if (currentDate > moment(user.tokenTimeToLive).valueOf()) {
  //     throw new HttpException('Token Expired', HttpStatus.UNAUTHORIZED);
  //   }
  //   console.log({
  //     token,
  //     userToken: user.resetPasswordToken,
  //   });
  //   if (token !== user.resetPasswordToken) {
  //     throw new HttpException('Token Doesnt Match', HttpStatus.UNAUTHORIZED);
  //   }
  //   const hashedPass = await bcrypt.hash(password, BCRYPT_HASH_ROUND);
  //   user.password = hashedPass;
  //   user.confirmUserToken = null;
  //   user.tokenTimeToLive = null;
  //   await user.save();
  // }
}
