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

@ApiTags('Auth')
@ApiExtraModels(UserModel)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register() {
    return;
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
                user: {
                  $ref: getSchemaPath(UserModel),
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

  @Get('confirmEmail')
  async getConfirmEmailToken() {
    return;
  }

  @Post('confirmEmail')
  async confirmEmail() {
    return;
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
