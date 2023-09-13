import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { RmqService } from '@app/rmq';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.connectMicroservice(rmqService.getOptions('NOTIFICATION', true));
  app.init();
  await app.startAllMicroservices();
}
bootstrap();
