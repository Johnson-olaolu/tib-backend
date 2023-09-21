import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PaymentMethodService } from '../payment-method/payment-method.service';
import { defaultPaymentMethods } from '../utils/constants';
import { join } from 'path';
import * as fs from 'fs';
import { CreatePaymentMethodDto } from '@app/shared/dto/wallet/create-payment-method.dto';
import * as mime from 'mime-types';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  logger = new Logger(SeedService.name);
  constructor(private paymentMethodService: PaymentMethodService) {}
  async onApplicationBootstrap() {
    await this.seedPaymentMethods();
  }

  async seedPaymentMethods() {
    const directoryPath = join(__dirname, '/assets/images');
    for (const paymentMethod of defaultPaymentMethods) {
      try {
        await this.paymentMethodService.findOneByName(paymentMethod.name);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _ = this;
        await fs.readFile(
          join(directoryPath, paymentMethod.image),
          async (err, data) => {
            const createPaymentMethodDto: CreatePaymentMethodDto = {
              ...paymentMethod,
              image: {
                buffer: data.toJSON(),
                mimetype: mime.contentType(paymentMethod.image),
              } as any,
            };
            await this.paymentMethodService.create(createPaymentMethodDto);
            _.logger.log(`Payment Method: ${paymentMethod.name} seeded`);
          },
        );
      }
    }
  }
}
