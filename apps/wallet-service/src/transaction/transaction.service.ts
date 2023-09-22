import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCreditTransactionDto } from './dto/create-transaction.dto';
import { PaystackService } from '../paystack/paystack.service';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { Repository } from 'typeorm';
import {
  TransactionProgressEnum,
  TransactionTypeEnum,
} from '../utils/constants';

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
        createTransactionDto.amount,
        createTransactionDto.reference,
      );
      const transaction = this.transactionRepository.create({
        amount: createTransactionDto.amount,
        paymentMethod: createTransactionDto.paymentMethod,
        wallet: createTransactionDto.wallet,
        reference: createTransactionDto.reference,
        paystackTransactionUrl: response.authorization_url,
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
}
