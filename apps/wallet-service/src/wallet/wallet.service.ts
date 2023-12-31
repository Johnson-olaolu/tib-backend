import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
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
  TransferNotificationData,
} from '@app/shared/dto/notification/notificationTypes';
import {
  ConfirmDebitWalletDto,
  InitiateDebitWalletDto,
} from '@app/shared/dto/wallet/debit-wallet.dto';
import { TransferMoneyDto } from '@app/shared/dto/wallet/transfer-money.dto';
import { ServicePaymentDto } from '@app/shared/dto/wallet/service-payment.dto';

@Injectable()
export class WalletService implements OnApplicationBootstrap {
  private adminWallet: Wallet;
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

  async onApplicationBootstrap() {
    try {
      const user = await lastValueFrom(
        this.userClient.send<UserModel>(
          'findOneUserByEmailOrUserName',
          'SuperAdmin',
        ),
      );
      this.adminWallet = await this.getUserWalletDetails(user.id);
    } catch (error) {
      console.log(error);
    }
  }

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

  async confirmCredit(confirmCreditWalletDto: ConfirmCreditWalletDto) {
    const wallet = await this.findOne(confirmCreditWalletDto.walletId);
    const user = await lastValueFrom(
      this.userClient.send<UserModel>('findOneUser', wallet.userId),
    );
    const transaction = await this.transactionService.findOne(
      confirmCreditWalletDto.transactionId,
    );
    const walletTransaction = await this.walletTransactionRepository.save({
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
    const transferCreditNotification: INotification<TransferNotificationData> =
      {
        type: ['email', 'push'],
        recipient: {
          name: user.userName,
          mail: user.email,
        },
        data: {
          amount: confirmCreditWalletDto.amount,
          description: walletTransaction.description,
        },
      };
    await firstValueFrom(
      this.notificationClient.emit('creditWallet', transferCreditNotification),
    );
    return true;
  }

  async initiateDebit(initiateDebitWalletDto: InitiateDebitWalletDto) {
    const wallet = await this.findOne(initiateDebitWalletDto.walletId);
    if (wallet.balance < initiateDebitWalletDto.amount.value) {
      throw new RpcException(
        new BadRequestException('Wallet Balance Is Too Low'),
      );
    }
    const user = await lastValueFrom(
      this.userClient.send<UserModel>('findOneUser', wallet.userId),
    );
    const transactionRef = generateReference(
      WalletTransactionActionEnum.WITHDRAWAL,
    );
    const transaction = await this.transactionService.createDebitTransaction({
      accountName: initiateDebitWalletDto.accountName,
      accountNumber: initiateDebitWalletDto.accountNumber,
      amount: initiateDebitWalletDto.amount,
      bankCode: initiateDebitWalletDto.bankCode,
      reference: transactionRef,
      user: user,
      wallet: wallet,
    });

    return transaction;
  }

  async confirmDebit(confirmDebitWalletDto: ConfirmDebitWalletDto) {
    const wallet = await this.findOne(confirmDebitWalletDto.walletId);
    const user = await lastValueFrom(
      this.userClient.send<UserModel>('findOneUser', wallet.userId),
    );
    const transaction = await this.transactionService.findOne(
      confirmDebitWalletDto.transactionId,
    );
    const recipient = await this.transactionService.getRecipient(
      transaction.paystackRecipientCode,
    );
    const walletTransaction = await this.walletTransactionRepository.save({
      action: WalletTransactionActionEnum.WITHDRAWAL,
      amount: confirmDebitWalletDto.amount,
      currBalance: wallet.balance - confirmDebitWalletDto.amount,
      prevBalance: wallet.balance,
      transactionReference: transaction.reference,
      currency: transaction.currency,
      type: TransactionTypeEnum.DEBIT,
      transaction: transaction,
      wallet: wallet,
      description: `Transfer to ${recipient.details.account_name}  ${recipient.details.bank_name} - ${recipient.details.bank_name}`,
      recipeint: JSON.stringify({
        accountName: recipient.details.account_name,
        accountNumber: recipient.details.account_number,
        bankName: recipient.details.bank_name,
      }),
    });
    wallet.balance = wallet.balance - confirmDebitWalletDto.amount;
    await wallet.save();
    const transferDebitNotification: INotification<TransferNotificationData> = {
      type: ['email', 'push'],
      recipient: {
        name: user.userName,
        mail: user.email,
      },
      data: {
        amount: confirmDebitWalletDto.amount,
        description: walletTransaction.description,
      },
    };
    await firstValueFrom(
      this.notificationClient.emit('debitWallet', transferDebitNotification),
    );
    return true;
  }

  async transferMoney(transferMoneyDto: TransferMoneyDto) {
    const wallet = await this.findOne(transferMoneyDto.walletId);
    if (wallet.balance < transferMoneyDto.amount) {
      throw new RpcException(
        new BadRequestException('Wallet Balance Is Too Low'),
      );
    }
    const recieverWallet = await this.getUserWalletDetails(
      transferMoneyDto.recieverId,
    );
    const user = await lastValueFrom(
      this.userClient.send<UserModel>('findOneUser', wallet.userId),
    );
    const recieverUser = await lastValueFrom(
      this.userClient.send<UserModel>(
        'findOneUser',
        transferMoneyDto.recieverId,
      ),
    );
    const transactionRef = generateReference(
      WalletTransactionActionEnum.TRANSFER,
    );

    //transaction for sender
    const walletTransaction = await this.walletTransactionRepository.save({
      action: WalletTransactionActionEnum.TRANSFER,
      amount: transferMoneyDto.amount,
      wallet: wallet,
      recipient: JSON.stringify({
        walletId: recieverWallet.id,
        userName: recieverUser.userName,
        recieverId: recieverUser.id,
      }),
      transactionReference: transactionRef,
      currBalance: wallet.balance - transferMoneyDto.amount,
      prevBalance: wallet.balance,
      description: `Transfer to ${recieverUser.userName}`,
      currency: transferMoneyDto.currency,
      type: TransactionTypeEnum.DEBIT,
    });
    wallet.balance = wallet.balance - transferMoneyDto.amount;
    await wallet.save();
    const debitWalletNotification: INotification<TransferNotificationData> = {
      type: ['email', 'push'],
      recipient: {
        name: user.userName,
        mail: user.email,
      },
      data: {
        amount: transferMoneyDto.amount,
        description: walletTransaction.description,
      },
    };
    await firstValueFrom(
      this.notificationClient.emit('debitWallet', debitWalletNotification),
    );

    //trasaction for reciever
    const recieverWalletTransaction =
      await this.walletTransactionRepository.save({
        action: WalletTransactionActionEnum.RECIEVE,
        amount: transferMoneyDto.amount,
        currBalance: recieverWallet.balance + transferMoneyDto.amount,
        prevBalance: recieverWallet.balance,
        transactionReference: transactionRef,
        currency: transferMoneyDto.currency,
        type: TransactionTypeEnum.CREDIT,
        wallet: wallet,
        description: `Transfer from ${user.userName}`,
        recipeint: JSON.stringify({
          walletId: wallet.id,
          userName: user.userName,
          senderId: user.id,
        }),
      });
    recieverWallet.balance = recieverWallet.balance + transferMoneyDto.amount;
    await recieverWallet.save();
    const creditWalletNotification: INotification<TransferNotificationData> = {
      type: ['email', 'push'],
      recipient: {
        name: user.userName,
        mail: user.email,
      },
      data: {
        amount: transferMoneyDto.amount,
        description: recieverWalletTransaction.description,
      },
    };
    await firstValueFrom(
      this.notificationClient.emit('creditWallet', creditWalletNotification),
    );
    return walletTransaction;
  }

  async servicePayment(servicePaymentDto: ServicePaymentDto) {
    const wallet = await this.getUserWalletDetails(servicePaymentDto.userId);
    if (wallet.balance < servicePaymentDto.amount) {
      throw new RpcException(
        new BadRequestException('Wallet Balance Is Too Low'),
      );
    }
    const user = await lastValueFrom(
      this.userClient.send<UserModel>('findOneUser', wallet.userId),
    );
    const transactionRef = generateReference(
      WalletTransactionActionEnum.PAYMENT,
    );
    const walletTransaction = await this.walletTransactionRepository.save({
      action: WalletTransactionActionEnum.PAYMENT,
      amount: servicePaymentDto.amount,
      wallet: wallet,
      recipient: JSON.stringify({
        walletId: this.adminWallet.id,
        userName: 'The Idea Bank',
      }),
      transactionReference: transactionRef,
      currBalance: wallet.balance - servicePaymentDto.amount,
      prevBalance: wallet.balance,
      description: `Payment for ${servicePaymentDto.plan} plan`,
      type: TransactionTypeEnum.DEBIT,
    });
    wallet.balance = wallet.balance - servicePaymentDto.amount;
    await wallet.save();

    const debitWalletNotification: INotification<TransferNotificationData> = {
      type: ['email', 'push'],
      recipient: {
        name: user.userName,
        mail: user.email,
      },
      data: {
        amount: servicePaymentDto.amount,
        description: walletTransaction.description,
      },
    };
    await firstValueFrom(
      this.notificationClient.emit('debitWallet', debitWalletNotification),
    );
    return walletTransaction;
  }
}
