import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserModel } from '../../../../libs/shared/src/model/user.model';
import { ProfileModel } from './model/profile.model';
import { ResponseDto } from '../utils/Response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { WalletModel } from '@app/shared/model/wallet.model';
import { UpgradePlanDto } from '@app/shared/dto/user-service/upgrade-plan.dto';

@ApiBearerAuth()
@ApiTags('User')
@ApiExtraModels(UserModel, ProfileModel, WalletModel)
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
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
  @Patch(':userId/profile')
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Param('userId') userId: string,
  ) {
    const data = await this.userService.updateUserProfile(
      userId,
      updateProfileDto,
    );
    return {
      success: true,
      message: 'user profile updated successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
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
  @UseInterceptors(FileInterceptor('file'))
  @Patch(':userId/profilePicture')
  async updateProfilePicture(
    @Param('userId') userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1e7 }),
          // new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file: Express.Multer.File,
  ) {
    const data = await this.userService.updateUserProfilePicture(userId, file);
    return {
      success: true,
      message: 'user profile Picture updated successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
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
  @Patch(':userId/upgradePlan')
  async upgradeUserPlan(
    @Param('userId') userId: string,
    @Body() upgradeUserPlanDto: Omit<UpgradePlanDto, 'userId'>,
  ) {
    const data = await this.userService.upgradeUserPlan(
      userId,
      upgradeUserPlanDto,
    );
    return {
      success: true,
      message: 'user Plan upgraded successfully',
      data: data,
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'User details fetched updated successfully',
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
  @Get('me')
  async getUserDetails(@Req() request: Request) {
    const user = (request as any).user as UserModel;
    const data = await this.userService.getUserDetails(user.id);
    return {
      success: true,
      message: 'user details fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Wallet details fetched  successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(WalletModel),
            },
          },
        },
      ],
    },
  })
  @Get(':id/wallet')
  async getWalletDetails(@Param('id') userId: string) {
    const data = await this.userService.getUserWalletDetails(userId);
    return {
      success: true,
      message: 'wallet fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'User details fetched  successfully',
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
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findOne(id);
    return {
      success: true,
      message: 'user logged in successfully',
      data: data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
