import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { RmqService } from 'libs/rabbitmq/src';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('USER', true));
  app.init();
  await app.startAllMicroservices();
}
bootstrap();
