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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/loginGuard.guard';
import { UserModel } from '../user/model/user.model';
import { ResponseDto } from '../utils/Response.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ProfileModel } from '../user/model/profile.model';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Auth')
@ApiExtraModels(UserModel, ProfileModel)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'Plans fetched successfully',
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
      message: 'user logged in successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Plans fetched successfully',
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

  @UseGuards(AuthGuard('jwt`'))
  @Get('confirmEmail')
  async getConfirmEmailToken(@Req() request: Request) {
    const user = (request as any).user as UserModel;
    await this.authService.generateConfirmAccountToken(user);
    return {
      success: true,
      message: 'New Token generated, Please check your email',
    };
  }

  @UseGuards(AuthGuard('jwt`'))
  @Post('confirmEmail')
  async confirmEmail(@Req() request: Request, @Body() body) {
    const user = (request as any).user as UserModel;
    const data = await this.authService.confirmNewUser(user, body.token);
    return {
      success: true,
      message: 'Email Confirmed',
      data,
    };
  }

  @Get('changePassword')
  async getPasswordResetLink() {
    return;
  }

  @Post('changePassword')
  async changePassword() {
    return;
  }
}
