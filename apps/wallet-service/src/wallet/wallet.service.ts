import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from '../../../../libs/shared/src/dto/wallet/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AddPaymentMethodDto } from '@app/shared/dto/wallet/add-payment-method.dto';
import { WalletPaymentMethod } from './entities/wallet-payment-method.entity';
import { PaymentMethodService } from '../payment-method/payment-method.service';
import { UpdatePaymentMethodDto } from '../payment-method/dto/update-payment-method.dto';
import {
  UpdateWalletPaymentMethodFieldDto,
  UpdateWalletPaymentMethodDefaultDto,
} from './dto/update-payment-method.dto';
import { InitiateCreditWalletDto } from '@app/shared/dto/wallet/credit-wallet.dto';
import { lastValueFrom } from 'rxjs';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { UserModel } from '@app/shared/model/user.model';
import { TransactionService } from '../transaction/transaction.service';
import { generateReference } from '../utils/misc';
import { WalletTransactionActionEnum } from '../utils/constants';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletPaymentMethod)
    private walletPaymentMethodRepository: Repository<WalletPaymentMethod>,
    private paymentMethodService: PaymentMethodService,
    private transactionService: TransactionService,
    @Inject(RABBITMQ_QUEUES.USER_SERVICE) private userClient: ClientProxy,
  ) {}
  async create(createWalletDto: CreateWalletDto) {
    const newWallet = await this.walletRepository.save(createWalletDto);
    return newWallet;
  }

  async findAll() {
    const wallets = await this.walletRepository.find();
    return wallets;
  }

  async findOne(id: string) {
    const wallet = await this.walletRepository.findOneBy({
      id,
    });

    if (!wallet) {
      throw new RpcException(
        new NotFoundException('Wallet not found for this ID'),
      );
    }
    return wallet;
  }

  async getWalletDetails(id: string) {
    const wallet = await this.walletRepository.findOne({
      where: {
        id,
      },
      relations: {
        transactions: true,
      },
    });

    if (!wallet) {
      throw new RpcException(
        new NotFoundException('Wallet not found for this ID'),
      );
    }
    return wallet;
  }

  async getUserWalletDetails(userId: string) {
    const wallet = await this.walletRepository.findOne({
      where: {
        userId,
      },
      relations: {
        transactions: true,
      },
    });

    if (!wallet) {
      throw new RpcException(
        new NotFoundException('Wallet not found for this ID'),
      );
    }
    return wallet;
  }

  async remove(id: string) {
    const deleteResponse = await this.walletRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RpcException(
        new NotFoundException('Wallet not found for this ID'),
      );
    }
  }

  //Default Payment Method
  async addPaymentMethod(addPaymentMethodDto: AddPaymentMethodDto) {
    const wallet = await this.findOne(addPaymentMethodDto.walletId);
    const paymentMethod = await this.paymentMethodService.findOneByName(
      addPaymentMethodDto.name,
    );
    this.paymentMethodService.validateFields(
      paymentMethod.name,
      addPaymentMethodDto.fields,
    );
    const walletPaymentMethod = await this.walletPaymentMethodRepository.save({
      paymentMethod,
      wallet,
      defaultFields: JSON.stringify(addPaymentMethodDto.fields),
    });
    return walletPaymentMethod;
  }

  async updatePaymentMethodField(
    updateWalletPaymentMethodDto: UpdateWalletPaymentMethodFieldDto,
  ) {
    const walletPaymentMethod =
      await this.walletPaymentMethodRepository.findOne({
        where: {
          wallet: {
            id: updateWalletPaymentMethodDto.walletId,
          },
          paymentMethod: {
            name: updateWalletPaymentMethodDto.name,
          },
        },
        relations: {
          wallet: true,
          paymentMethod: true,
        },
      });

    this.paymentMethodService.validateFields(
      walletPaymentMethod.paymentMethod.name,
      updateWalletPaymentMethodDto.fields,
    );
    walletPaymentMethod.defaultFields = JSON.stringify(
      updateWalletPaymentMethodDto.fields,
    );
    return walletPaymentMethod;
  }

  async updatePaymentMethodDefault(
    updateWalletPaymentMethodDto: UpdateWalletPaymentMethodDefaultDto,
  ) {
    const walletPaymentMethod =
      await this.walletPaymentMethodRepository.findOne({
        where: {
          wallet: {
            id: updateWalletPaymentMethodDto.walletId,
          },
          paymentMethod: {
            name: updateWalletPaymentMethodDto.name,
          },
        },
        relations: {
          wallet: true,
          paymentMethod: true,
        },
      });

    const defaultWalletPaymentMethod =
      await this.walletPaymentMethodRepository.findOne({
        where: {
          wallet: {
            id: updateWalletPaymentMethodDto.walletId,
          },
          isDefault: true,
        },
      });

    if (defaultWalletPaymentMethod) {
      defaultWalletPaymentMethod.isDefault = false;
      await defaultWalletPaymentMethod.save();
    }

    walletPaymentMethod.isDefault = true;
    await walletPaymentMethod.save();
    return walletPaymentMethod;
  }

  //Wallet transactions
  async initiateCredit(creditWalletDto: InitiateCreditWalletDto) {
    const wallet = await this.findOne(creditWalletDto.walletId);
    const paymentMethod = await this.paymentMethodService.findOneByName(
      creditWalletDto.paymentMethod,
    );
    const user = await lastValueFrom(
      this.userClient.send<UserModel>('findOneUser', wallet.userId),
    );
    const transactionRef = generateReference(
      WalletTransactionActionEnum.DEPOSIT,
    );
    const response = await this.transactionService.createCreditTransaction({
      amount: creditWalletDto.amount,
      reference: transactionRef,
      user: user,
      wallet: wallet,
      paymentMethod: paymentMethod,
    });
    return response;
  }

  async confirmCredit() {
    return 'confirm credit';
  }

  async debitAccount() {
    return 'debit account';
  }
}
