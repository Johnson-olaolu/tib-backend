import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaymentMethodModel } from '@app/shared/model/payment-method.model';
import { CreatePaymentMethodDto } from '@app/shared/dto/wallet/create-payment-method.dto';
import { UpdatePaymentMethodDto } from 'apps/wallet-service/src/payment-method/dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodService {
  constructor(
    @Inject(RABBITMQ_QUEUES.WALLET_SERVICE) private walletClient: ClientProxy,
  ) {}
  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const paymentMethod = await lastValueFrom(
      this.walletClient.send<PaymentMethodModel>(
        'createPaymentMethod',
        createPaymentMethodDto,
      ),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return paymentMethod;
  }

  async findAll() {
    const paymentMethods = await lastValueFrom(
      this.walletClient.send<PaymentMethodModel[]>('findAllPaymentMethod', {}),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return paymentMethods;
  }

  async findOne(id: string) {
    const paymentMethod = await lastValueFrom(
      this.walletClient.send<PaymentMethodModel>('findOnePaymentMethod', id),
    ).catch((error) => {
      throw new RpcException(error.response);
    });
    return paymentMethod;
  }

  async update(
    id: string,
    updatePaymentMethodDto: Omit<UpdatePaymentMethodDto, 'id'>,
  ) {
    const paymentMethod = await lastValueFrom(
      this.walletClient.send<PaymentMethodModel>('updatePaymentMethod', {
        id,
        ...updatePaymentMethodDto,
      }),
    );
    return paymentMethod;
  }

  remove(id: number) {
    return `This action removes a #${id} paymentMethod`;
  }
}
