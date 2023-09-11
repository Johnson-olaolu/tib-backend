import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register() {
    return;
  }

  @Post('login')
  async login() {
    return;
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
