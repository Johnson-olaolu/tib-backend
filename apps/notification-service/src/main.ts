import { NestFactory } from '@nestjs/core';
import { NotificationServiceModule } from './notification-service.module';
import { RmqService } from '@app/rmq';
import { ValidationPipe } from '@nestjs/common';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(NotificationServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice(
    rmqService.getOptions(RABBITMQ_QUEUES.NOTIFICATION_SERVICE, true),
  );
  app.init();
  await app.startAllMicroservices();
  await app.listen(app.get(ConfigService).get('PORT') || 3000);
}
bootstrap();
