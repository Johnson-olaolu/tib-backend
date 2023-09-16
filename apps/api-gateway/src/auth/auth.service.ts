import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { UserModel } from '../user/model/user.model';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ConfirmUserDto } from '@app/shared/dto/user-service/confirm-user.dto';
import { ChangePasswordDto } from '@app/shared/dto/user-service/change-password.dto';
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
    console.log(usernameOrEmail);
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

  async generateConfirmAccountToken(user: UserModel) {
    try {
      await firstValueFrom(
        this.userClient.emit('generateConfirmEmailToken', user.id),
      );
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  async confirmNewUserEmail(user: UserModel, token: string) {
    try {
      const confirmUserDto: ConfirmUserDto = {
        token,
        userId: user.id,
      };
      const confirmedUser = await lastValueFrom(
        this.userClient.send<UserModel>('confirmEmail', confirmUserDto),
      );
      return confirmedUser;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  async getPasswordResetLink(email: string) {
    try {
      await firstValueFrom(
        this.userClient.emit('generatePasswordResetToken', email),
      );
    } catch (error) {
      throw new RpcException(error.response);
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    try {
      const user = await lastValueFrom(
        this.userClient.send<UserModel>('changePassword', changePasswordDto),
      );
      return user;
    } catch (error) {
      throw new RpcException(error.response);
    }
  }
}
