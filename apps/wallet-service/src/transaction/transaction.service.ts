import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateCreditTransactionDto,
  CreateDebitTransactionDto,
} from './dto/create-transaction.dto';
import { PaystackService } from '../paystack/paystack.service';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import {
  TransactionProgressEnum,
  TransactionTypeEnum,
} from '../utils/constants';
import { ResolveAccountDto } from '@app/shared/dto/wallet/resolve-account.dto';

@Injectable()
export class TransactionService {
  constructor(
    private paystackService: PaystackService,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async createCreditTransaction(
    createTransactionDto: CreateCreditTransactionDto,
  ) {
    if (
      createTransactionDto.paymentMethod.name === 'Card' ||
      createTransactionDto.paymentMethod.name === 'Bank'
    ) {
      const response = await this.paystackService.initiateTransaction(
        createTransactionDto.user.email,
        createTransactionDto.amount.value,
        createTransactionDto.reference,
        createTransactionDto.amount.currency,
      );
      const transaction = this.transactionRepository.create({
        amount: createTransactionDto.amount.value,
        paymentMethod: createTransactionDto.paymentMethod,
        wallet: createTransactionDto.wallet,
        reference: createTransactionDto.reference,
        paystackTransactionUrl: response.authorization_url,
        currency: createTransactionDto.amount.currency,
        type: TransactionTypeEnum.CREDIT,
      });
      await transaction.save();
      return transaction;
    } else {
      throw new RpcException(
        new BadRequestException('Payment method Not currently supported'),
      );
    }
  }

  async verifyCreditTransactionPaystack(reference: string) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        reference: reference,
      },
      relations: {
        wallet: true,
      },
    });
    const response = await this.paystackService.verifyTransaction(reference);
    transaction.progress = TransactionProgressEnum.COMPLETED;
    transaction.status = response.status;
    transaction.paystackTransactionId = response.id.toString();
    transaction.currency = response.currency;
    await transaction.save();
    return transaction;
  }

  async createDebitTransaction(
    createDebitTransactionDto: CreateDebitTransactionDto,
  ) {
    try {
      const recipient = await this.createRecipient(
        createDebitTransactionDto.accountName,
        createDebitTransactionDto.accountNumber,
        createDebitTransactionDto.bankCode,
      );
      const response = await this.paystackService.initiateTransfer(
        recipient.recipient_code,
        createDebitTransactionDto.amount.value,
        createDebitTransactionDto.reference,
        'Transfer from TIB',
      );
      const transaction = this.transactionRepository.create({
        amount: createDebitTransactionDto.amount.value,
        wallet: createDebitTransactionDto.wallet,
        reference: createDebitTransactionDto.reference,
        type: TransactionTypeEnum.DEBIT,
        paystackRecipientCode: recipient.recipient_code,
      });
      await transaction.save();
      return transaction;
    } catch (error) {
      throw new RpcException(new InternalServerErrorException(error.response));
    }
  }

  async verifyDebitTransactionPaystack(reference: string) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        reference: reference,
      },
      relations: {
        wallet: true,
      },
    });
    const response = await this.paystackService.verifyTransfer(reference);
    transaction.progress = TransactionProgressEnum.COMPLETED;
    transaction.status = response.status;
    transaction.paystackTransactionId = response.id.toString();
    transaction.currency = response.currency;
    await transaction.save();
    return transaction;
  }

  findAll() {
    return `This action returns all transaction`;
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOneBy({
      id,
    });
    if (!transaction) {
      throw new RpcException(
        new NotFoundException('Transaction not found for this ID'),
      );
    }
    return transaction;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }

  //banks and validation
  async getBanks() {
    return await this.paystackService.getBanks();
  }

  async resolveAccount(resolveAccountDto: ResolveAccountDto) {
    return await this.paystackService.resolveAccount(
      resolveAccountDto.bankCode,
      resolveAccountDto.accountNumber,
    );
  }

  //recipient
  async createRecipient(name, accountNumber, bankCode) {
    return await this.paystackService.createRecipient(
      name,
      accountNumber,
      bankCode,
    );
  }

  async getRecipient(recipientCode: string) {
    return this.paystackService.getRecipeint(recipientCode);
  }
}
