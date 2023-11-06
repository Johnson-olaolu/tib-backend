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
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UserModel } from '../../../../libs/shared/src/model/user.model';
import { ProfileModel } from '../../../../libs/shared/src/model/profile.model';
import { ResponseDto } from '../utils/Response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UpdateProfileDto } from '@app/shared/dto/user-service/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { WalletModel } from '@app/shared/model/wallet.model';
import { UpgradePlanDto } from '@app/shared/dto/user-service/upgrade-plan.dto';
import { QueryUserDto } from '@app/shared/dto/user-service/query-user.dto';
import {
  FollowUserDto,
  HandleFollowDto,
} from '@app/shared/dto/user-service/follow-user.dto';
import { FollowStatusEnum } from 'apps/user-service/src/utils/constants';
import { FollowModel } from '@app/shared/model/follow.model';
import { BlockModel } from '@app/shared/model/block.model';
import { ReportModel } from '@app/shared/model/report.model';
import {
  BlockUserDto,
  UnBlockUserDto,
} from '@app/shared/dto/user-service/block-user.dto';

@ApiBearerAuth()
@ApiTags('User')
@ApiExtraModels(
  UserModel,
  ProfileModel,
  WalletModel,
  FollowModel,
  BlockModel,
  ReportModel,
)
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
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

  @Get('query')
  async query(@Query() query: QueryUserDto) {
    const data = await this.userService.query(query);
    return {
      success: true,
      message: 'user queried successfully',
      data: data,
    };
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
    description: 'follow request sent successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(FollowModel),
            },
          },
        },
      ],
    },
  })
  @Post(':id/follow-user')
  async followUser(
    @Param('id') followerId: string,
    @Body() followUserDto: Omit<FollowUserDto, 'followerId'>,
  ) {
    const data = await this.userService.followUser({
      ...followUserDto,
      followerId,
    });
    return {
      success: true,
      message: 'follow request sent successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Follow request handled successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(FollowModel),
            },
          },
        },
      ],
    },
  })
  @Post(':id/handle-follow-request/:followRequestId')
  async handleFollowRequest(
    @Param('id') userId: string,
    @Param('followRequestId') followRequestId: string,
    @Body() handleFollowDto: Omit<HandleFollowDto, 'followId'>,
  ) {
    const data = await this.userService.handleFollow({
      ...handleFollowDto,
      userId,
      followRequestId,
    });
    return {
      success: true,
      message: 'follow request handled successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Follow request fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'object',
              properties: {
                following: {
                  type: 'array',
                  items: {
                    $ref: getSchemaPath(FollowModel),
                  },
                },
                followers: {
                  type: 'array',
                  items: {
                    $ref: getSchemaPath(FollowModel),
                  },
                },
              },
            },
          },
        },
      ],
    },
  })
  @Get(':id/follow')
  async getUserFollows(
    @Param('id') userId: string,
    @Query('status') status: FollowStatusEnum,
  ) {
    const data = await this.userService.fetchFollows({
      userId,
      status,
    });
    return {
      success: true,
      message: 'Follow requests fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'User Blocked successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(BlockModel),
            },
          },
        },
      ],
    },
  })
  @Post(':id/follow')
  async blockUser(
    @Param('id') userId: string,
    @Body() blockUserDto: Omit<BlockUserDto, 'userId'>,
  ) {
    const data = await this.userService.blockUser({
      ...blockUserDto,
      userId,
    });
    return {
      success: true,
      message: 'User blocked successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'User UnBlocked successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(null),
            },
          },
        },
      ],
    },
  })
  @Post(':id/follow')
  async unBlockUser(
    @Param('id') userId: string,
    @Body() unBlockUserDto: Omit<UnBlockUserDto, 'userId'>,
  ) {
    const data = await this.userService.unBlockUser({
      ...unBlockUserDto,
      userId,
    });
    return {
      success: true,
      message: 'User blocked successfully',
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
