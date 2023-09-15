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
  ParseFilePipeBuilder,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserModel } from './model/user.model';
import { ProfileModel } from './model/profile.model';
import { ResponseDto } from '../utils/Response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('User')
@ApiExtraModels(UserModel, ProfileModel)
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

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('me')
  async GetUserDetails(@Req() request: Request) {
    const user = (request as any).user as UserModel;
    const data = await this.userService.getUserDetails(user.id);
    return {
      success: true,
      message: 'user details fetched successfully',
      data: data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userService.findOne(id);
    return {
      success: true,
      message: 'user logged in successfully',
      data: data,
    };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
