import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Req,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserModel } from '../../../../libs/shared/src/model/user.model';
import { ResponseDto } from '../utils/Response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProfileModel } from '../../../../libs/shared/src/model/profile.model';
import { AuthGuard } from '@nestjs/passport';
import { GetPasswordResetLinkDto } from './dto/get-password-reset-link.dto';
import { ChangePasswordDto } from '@app/shared/dto/user-service/change-password.dto';
import { ConfirmEmailAPIDto } from './dto/confirm-email.dto';
import { LocalAuthGuard } from '../guards/loginGuard.guard';

@ApiTags('Auth')
@ApiExtraModels(UserModel, ProfileModel)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'User registered successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      ],
    },
  })
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.registerNewUser(registerDto);
    return {
      success: true,
      message:
        'Your account on TIB has been created, please confirm your email',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Login Successfull',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                accessToken: {
                  type: 'string',
                },
              },
            },
          },
        },
      ],
    },
  })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Req() request: Request, @Body() loginDto: LoginDto) {
    const user = (request as any).user as UserModel;
    const data = await this.authService.loginUser(user);
    return {
      success: true,
      message: 'user logged in successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Email confirmation token created',
    schema: {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Get('confirm-email')
  async getConfirmEmailToken(@Req() request: Request) {
    const user = (request as any).user as UserModel;
    await this.authService.generateConfirmAccountToken(user);
    return {
      success: true,
      message: 'New token generated, Please check your email',
    };
  }

  @ApiResponse({
    status: 201,
    description: 'Email confirmed',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(UserModel),
            },
          },
        },
      ],
    },
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(201)
  @Post('confirm-email')
  async confirmEmail(
    @Req() request: Request,
    @Body() body: ConfirmEmailAPIDto,
  ) {
    const user = (request as any).user as UserModel;
    const data = await this.authService.confirmNewUserEmail(user, body.token);
    return {
      success: true,
      message: 'Email Confirmed',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Get password reset link',
    schema: {
      allOf: [{ $ref: getSchemaPath(ResponseDto) }],
    },
  })
  @Get('change-password')
  async getPasswordResetLink(@Query('email') email: string) {
    await this.authService.getPasswordResetLink(email);
    return {
      success: true,
      message: 'Password reset link sent to your mail',
    };
  }

  @ApiResponse({
    status: 201,
    description: 'Change Password',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(UserModel),
            },
          },
        },
      ],
    },
  })
  @HttpCode(201)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const data = await this.authService.changePassword(changePasswordDto);
    return {
      success: true,
      message: 'Password changed Succesfully',
      data,
    };
  }
}
