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
import {
  ConfirmCreditWalletDto,
  InitiateCreditWalletDto,
} from '@app/shared/dto/wallet/credit-wallet.dto';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { UserModel } from '@app/shared/model/user.model';
import { TransactionService } from '../transaction/transaction.service';
import { generateReference } from '../utils/misc';
import {
  TransactionTypeEnum,
  WalletTransactionActionEnum,
} from '../utils/constants';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import {
  INotification,
  TransferCreditNotificationData,
} from '@app/shared/dto/notification/notificationTypes';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
    @InjectRepository(WalletPaymentMethod)
    private walletPaymentMethodRepository: Repository<WalletPaymentMethod>,
    @InjectRepository(WalletTransaction)
    private walletTransactionRepository: Repository<WalletTransaction>,
    private paymentMethodService: PaymentMethodService,
    private transactionService: TransactionService,
    @Inject(RABBITMQ_QUEUES.USER_SERVICE) private userClient: ClientProxy,
    @Inject(RABBITMQ_QUEUES.NOTIFICATION_SERVICE)
    private notificationClient: ClientProxy,
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
    console.log(user);
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

  async confirmCredit(confirmCreditWalletDto: ConfirmCreditWalletDto) {
    const wallet = await this.findOne(confirmCreditWalletDto.walletId);
    const user = await lastValueFrom(
      this.userClient.send<UserModel>('findOneUser', wallet.userId),
    );
    const transaction = await this.transactionService.findOne(
      confirmCreditWalletDto.transactionId,
    );
    await this.walletTransactionRepository.save({
      action: WalletTransactionActionEnum.DEPOSIT,
      amount: confirmCreditWalletDto.amount,
      currBalance: wallet.balance + confirmCreditWalletDto.amount,
      prevBalance: wallet.balance,
      transactionReference: transaction.reference,
      currency: transaction.currency,
      type: TransactionTypeEnum.CREDIT,
      transaction: transaction,
      wallet: wallet,
      description: 'Deposit',
    });
    wallet.balance = wallet.balance + confirmCreditWalletDto.amount;
    await wallet.save();
    const transferCreditNotification: INotification<TransferCreditNotificationData> =
      {
        type: ['email', 'push'],
        recipient: {
          name: user.userName,
          mail: user.email,
        },
        data: {
          amount: confirmCreditWalletDto.amount,
        },
      };
    await firstValueFrom(
      this.notificationClient.emit('creditWallet', transferCreditNotification),
    );
    return true;
  }

  async debitAccount() {
    return 'debit account';
  }
}
