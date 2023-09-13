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

@ApiBearerAuth()
@ApiTags('User')
@ApiExtraModels(UserModel, ProfileModel)
@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @ApiResponse({
  //   status: 200,
  //   description: 'Plans fetched successfully',
  //   schema: {
  //     allOf: [
  //       { $ref: getSchemaPath(ResponseDto) },
  //       {
  //         properties: {
  //           data: {
  //             type: 'object',
  //             properties: {
  //               accessToken: {
  //                 type: 'string',
  //               },
  //               user: {
  //                 $ref: getSchemaPath(UserModel),
  //               },
  //             },
  //           },
  //         },
  //       },
  //     ],
  //   },
  // })
  // @ApiConsumes('multipart/form-data')
  // // @UseInterceptors(FileInterceptor('profilePicture'))
  // @Post(':userId/profile')
  // @FormDataRequest({ storage: FileSystemStoredFile })
  // create(
  //   @Body() createProfileDto: CreateProfileDto,
  //   // @UploadedFile() profilePicture: Express.Multer.File,
  //   @Param('userId') userId: string,
  // ) {
  //   console.log(userId);
  //   console.log(createProfileDto);
  //   // console.log(profilePicture);
  //   // const data = this.userService.createProfile(userId, createProfileDto);
  //   // return {
  //   //   success: true,
  //   //   message: 'user profile created successfully',
  //   //   data: data,
  //   // };
  // }

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
