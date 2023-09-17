import { NestFactory, Reflector } from '@nestjs/core';
import { WalletServiceModule } from './wallet-service.module';
import { RmqService } from '@app/rmq';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(WalletServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.connectMicroservice(
    rmqService.getOptions(RABBITMQ_QUEUES.WALLET_SERVICE, true),
  );
  app.init();
  await app.startAllMicroservices();
}
bootstrap();
