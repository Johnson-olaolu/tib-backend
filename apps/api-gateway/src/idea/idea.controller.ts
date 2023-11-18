import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import {
  CreateIdeaForSaleDto,
  CreateIdeaFundingNeededDto,
  CreateIdeaNewConceptDto,
  CreateIdeaSimpleDto,
} from '@app/shared/dto/idea/create-idea.dto';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { IdeaModel } from '@app/shared/model/idea.model';
import { AuthGuard } from '@nestjs/passport';
import { ResponseDto } from '../utils/Response.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { query } from 'express';
import { QueryIdeaSimpleDto } from '@app/shared/dto/idea/query-idea-simple.dto';
import { LikeIdeaDto } from '@app/shared/dto/idea/like-idea.dto';
import { ShareIdeaDto } from '@app/shared/dto/idea/share-idea.dto';
import { CreateCommentDto } from '@app/shared/dto/idea/create-comment.dto';
import { GetCommentsDto } from '@app/shared/dto/idea/get-comments.dto';
import { LikeModel } from '@app/shared/model/like.model';
import { ShareModel } from '@app/shared/model/share.model';
import { CommentModel } from '@app/shared/model/comment.model';

@ApiTags('Idea')
@ApiExtraModels(IdeaModel, CommentModel, LikeModel, ShareModel)
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
@Controller('idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @ApiResponse({
    status: 200,
    description: 'Idea created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaModel),
            },
          },
        },
      ],
    },
  })
  @Post('simple')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('media[]'))
  async createIdeaSimple(
    @UploadedFiles() media: Express.Multer.File[],
    @Body() createIdeaSimpleDto: CreateIdeaSimpleDto,
  ) {
    const data = await this.ideaService.createIdeaSimple({
      media,
      ...createIdeaSimpleDto,
    });
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Ideas fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(IdeaModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get('simple/query')
  async queryIdeaSimple(@Query() query: QueryIdeaSimpleDto) {
    const data = await this.ideaService.querySimpleIdea(query);
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaModel),
            },
          },
        },
      ],
    },
  })
  @Post('funding-needed')
  async createIdeaFundingNeeded(
    @Body() createIdeaFundingNeededDto: CreateIdeaFundingNeededDto,
  ) {
    const data = await this.ideaService.createIdeaFundingNeeded(
      createIdeaFundingNeededDto,
    );
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaModel),
            },
          },
        },
      ],
    },
  })
  @Post('for-sale')
  async createIdeaForSale(@Body() createIdeaForSaleDto: CreateIdeaForSaleDto) {
    const data = await this.ideaService.createIdeaForSale(createIdeaForSaleDto);
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(IdeaModel),
            },
          },
        },
      ],
    },
  })
  @Post('new-concept')
  async createIdea(@Body() createIdeaNewConceptDto: CreateIdeaNewConceptDto) {
    const data = await this.ideaService.createIdeaNewConcept(
      createIdeaNewConceptDto,
    );
    return {
      success: true,
      message: 'Idea Created Successfully',
      data,
    };
  }

  // @Get()
  // findAll() {
  //   return this.ideaService.findAll();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ideaService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Idea liked successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(LikeModel),
            },
          },
        },
      ],
    },
  })
  @Post(':id/like')
  async like(
    @Param('id') ideaId: string,
    @Body() likeIdeaDto: Omit<LikeIdeaDto, 'ideaId'>,
  ) {
    const data = await this.ideaService.like(ideaId, likeIdeaDto);
    return {
      success: true,
      message: 'Idea Liked Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea liked successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'boolean',
            },
          },
        },
      ],
    },
  })
  @Delete(':id/like/:likeId')
  async unlike(@Param('id') ideaId: string, @Param('likeId') likeId: string) {
    const data = await this.ideaService.unLike(likeId);
    return {
      success: true,
      message: 'Like Removed Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Idea liked successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(ShareModel),
            },
          },
        },
      ],
    },
  })
  @Post(':id/share')
  async share(
    @Param('id') ideaId: string,
    @Body() shareIdeaDto: Omit<ShareIdeaDto, 'ideaId'>,
  ) {
    const data = await this.ideaService.share(ideaId, shareIdeaDto);
    return {
      success: true,
      message: 'Idea Shared Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Share removed successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'boolean',
            },
          },
        },
      ],
    },
  })
  @Delete(':id/share/:shareId')
  async unShare(
    @Param('id') ideaId: string,
    @Param('shareId') shareId: string,
  ) {
    const data = await this.ideaService.unShare(shareId);
    return {
      success: true,
      message: 'Share Removed Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Comment made successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(CommentModel),
            },
          },
        },
      ],
    },
  })
  @Post(':id/comment')
  async comment(
    @Param('id') ideaId: string,
    @Body() createCommentDto: Omit<CreateCommentDto, 'ideaId'>,
  ) {
    console.log(createCommentDto);
    const data = await this.ideaService.comment(ideaId, createCommentDto);
    return {
      success: true,
      message: 'Comment created Successfully',
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Comments fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(CommentModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get(':id/comment')
  async getComment(
    @Param('id') ideaId: string,
    @Query() getCommentsDto: GetCommentsDto,
  ) {
    const data = await this.ideaService.getComments(getCommentsDto);
    return {
      success: true,
      message: 'Comments fetched Successfully',
      data,
    };
  }
  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
  //   return this.ideaService.update(+id, updateIdeaDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ideaService.remove(+id);
  // }
}
