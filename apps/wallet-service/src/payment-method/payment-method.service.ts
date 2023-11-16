import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePaymentMethodDto } from '../../../../libs/shared/src/dto/wallet/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment-method.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { SaveFileDto } from '@app/shared/dto/file/save-file.dto';
import { FileTypeEnum, RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { lastValueFrom } from 'rxjs';
import { FileModel } from '@app/shared/model/file.model';
import { validateCardFields } from './fields/card.fields';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentMethodRepository: Repository<PaymentMethod>,
    @Inject(RABBITMQ_QUEUES.FILE_SERVICE) private fileClient: ClientProxy,
  ) {}
  async create(createPaymentMethodDto: CreatePaymentMethodDto) {
    const fileDetails: SaveFileDto = {
      author: 'SuperAdmin',
      name: `${createPaymentMethodDto.name}Logo`,
      file: createPaymentMethodDto.image,
      mimetype: createPaymentMethodDto.image.mimetype,
      parent: 'SuperAdmin',
      type: FileTypeEnum.PAYMENT_METHOD,
    };

    const file = await lastValueFrom(
      this.fileClient.send<FileModel>('saveFile', fileDetails),
    );
    const newPaymentMethod = await this.paymentMethodRepository.save({
      ...createPaymentMethodDto,
      image: file.path,
    });
    return newPaymentMethod;
  }

  async findAll() {
    const paymentMethods = await this.paymentMethodRepository.find();
    return paymentMethods;
  }

  async findOne(id: string) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: {
        id,
      },
    });
    if (!paymentMethod) {
      throw new RpcException(
        new NotFoundException('Payment Method not found for this ID'),
      );
    }
    return paymentMethod;
  }

  async findOneByName(name: string) {
    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: {
        name,
      },
    });
    if (!paymentMethod) {
      throw new RpcException(
        new NotFoundException('Payment Method not found for this ID'),
      );
    }
    return paymentMethod;
  }

  async update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.findOne(id);

    if (updatePaymentMethodDto.image) {
      const fileDetails: SaveFileDto = {
        author: 'SuperAdmin',
        name: updatePaymentMethodDto.name,
        file: updatePaymentMethodDto.image,
        mimetype: updatePaymentMethodDto.image.mimetype,
        parent: 'SuperAdmin',
        type: FileTypeEnum.APP,
      };

      const file = await lastValueFrom(
        this.fileClient.send<FileModel>('updateFile', fileDetails),
      );
      updatePaymentMethodDto.image = file.path as any;
    }
    for (const detail in updatePaymentMethodDto) {
      paymentMethod[detail] = updatePaymentMethodDto[detail];
    }
    await paymentMethod.save();
    return paymentMethod;
  }

  async remove(id: string) {
    const deleteResponse = await this.paymentMethodRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new RpcException(
        new NotFoundException('Payment method not found for this ID'),
      );
    }
  }

  async validateFields(name: string, fields: Record<string, unknown>) {
    try {
      switch (name) {
        case 'Card':
          return validateCardFields(fields);
        default:
          return true;
      }
    } catch (error) {
      throw new RpcException(new BadRequestException(error.response));
    }
  }
}
