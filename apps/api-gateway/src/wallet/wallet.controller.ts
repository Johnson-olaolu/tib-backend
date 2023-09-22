import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseDto } from '../utils/Response.dto';
import { WalletModel } from '@app/shared/model/wallet.model';
import { CreditWalletDto } from './dto/credit-wallet.dto';
import { TransactionModel } from '@app/shared/model/transaction.model';
import { AuthGuard } from '@nestjs/passport';
import { DebitWalletDto } from './dto/debit-wallet.dto';

@ApiBearerAuth()
@ApiTags('Wallet')
@ApiExtraModels(WalletModel, TransactionModel)
@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

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
  @Get(':id')
  async getWalletDetails(@Param('id') walletId: string) {
    const data = await this.walletService.getWalletDetails(walletId);
    return {
      success: true,
      message: 'Wallet fetched successfully',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Credit Wallet Initiated',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(TransactionModel),
            },
          },
        },
      ],
    },
  })
  @Post(':walletId/creditWallet')
  async creditWallet(
    @Param('walletId') walletId: string,
    @Body() creditWalletDto: CreditWalletDto,
  ) {
    const data = await this.walletService.initiateCredit(
      walletId,
      creditWalletDto,
    );
    return {
      success: true,
      message: 'Credit wallet initiated',
      data: data,
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Credit Wallet Initiated',
    schema: {
      allOf: [
        { $ref: getSchemaPath(ResponseDto) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(TransactionModel),
            },
          },
        },
      ],
    },
  })
  @Post(':walletId/debitWallet')
  async debitWallet(
    @Param('walletId') walletId: string,
    @Body() debitWalletDto: DebitWalletDto,
  ) {
    const data = await this.walletService.initiateDebit(
      walletId,
      debitWalletDto,
    );
    return {
      success: true,
      message: 'Debit wallet initiated',
      data: data,
    };
  }
}
