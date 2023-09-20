import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWalletDto } from '../../../../libs/shared/src/dto/wallet/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Repository } from 'typeorm';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet) private walletRepository: Repository<Wallet>,
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

  async getWallet(id: string) {
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

  async remove(id: string) {
    const deleteResponse = await this.walletRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RpcException(
        new NotFoundException('Wallet not found for this ID'),
      );
    }
  }

  //Wallet transactions

  async initiateCredit() {
    return 'credit initiated';
  }

  async confirmCredit() {
    return 'confirm credit';
  }

  async debitAccount() {
    return 'debit account';
  }
}
