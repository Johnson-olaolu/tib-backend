import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { RABBITMQ_QUEUES } from '../utils/constants';
import { UserModel } from '../user/model/user.model';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class AuthService {
  constructor(
    @Inject(RABBITMQ_QUEUES.USER_SERVICE)
    private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}
  async getUser(usernameOrEmail: string) {
    const user = await lastValueFrom(
      this.userClient.send<UserModel>(
        'findOneUserByEmailOrUserName',
        usernameOrEmail,
      ),
    );
    return user;
  }

  async loginUser(user: UserModel) {
    const payload = { username: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return {
      accessToken: accessToken,
      user: user,
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

  async comparePasswords(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    const result = await bcrypt.compareSync(password, userPassword);
    return result;
  }
}
