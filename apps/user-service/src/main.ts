import { NestFactory, Reflector } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { RmqService } from 'libs/rabbitmq/src';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.connectMicroservice(rmqService.getOptions('USER', true));
  app.init();
  await app.startAllMicroservices();
}
bootstrap();
