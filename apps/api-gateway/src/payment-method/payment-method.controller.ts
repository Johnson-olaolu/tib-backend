import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { PaymentMethodModel } from '@app/shared/model/payment-method.model';
import { ResponseDto } from '../utils/Response.dto';
import RoleGuard from '../guards/roleGuards.guard';
import { CreatePaymentMethodDto } from '@app/shared/dto/wallet/create-payment-method.dto';
import { UpdatePaymentMethodDto } from 'apps/wallet-service/src/payment-method/dto/update-payment-method.dto';

@ApiBearerAuth()
@ApiTags('PaymentMethod')
@ApiExtraModels(PaymentMethodModel)
@Controller('payment-method')
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @ApiResponse({
    status: 200,
    description: 'PaymentMethod created successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PaymentMethodModel),
            },
          },
        },
      ],
    },
  })
  @UseGuards(RoleGuard(['super_admin', ' admin']))
  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createPaymentMethodDto: CreatePaymentMethodDto) {
    const data = await this.paymentMethodService.create(createPaymentMethodDto);
    return {
      message: 'Payment Method created successfully',
      status: true,
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Payment Methods fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: getSchemaPath(PaymentMethodModel),
              },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll() {
    const data = await this.paymentMethodService.findAll();
    return {
      message: 'Payment Methods fetched successfully',
      status: true,
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'PaymentMethod fetched successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PaymentMethodModel),
            },
          },
        },
      ],
    },
  })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.paymentMethodService.findOne(id);
    return {
      message: 'Payment Method fetched successfully',
      status: true,
      data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Payment Method updated successfully',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(PaymentMethodModel),
            },
          },
        },
      ],
    },
  })
  @UseGuards(RoleGuard(['super_admin', ' admin']))
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: Omit<UpdatePaymentMethodDto, 'id'>,
  ) {
    const data = await this.paymentMethodService.update(
      id,
      updatePaymentMethodDto,
    );
    return {
      message: 'Payment Method updated successfully',
      status: true,
      data,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentMethodService.remove(+id);
  }
}
