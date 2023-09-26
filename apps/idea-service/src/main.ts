import { NestFactory, Reflector } from '@nestjs/core';
import { IdeaServiceModule } from './idea-service.module';
import { RmqService } from '@app/rmq';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { RABBITMQ_QUEUES } from '@app/shared/utils/constants';

async function bootstrap() {
  const app = await NestFactory.create(IdeaServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.connectMicroservice(
    rmqService.getOptions(RABBITMQ_QUEUES.IDEA_SERVICE, true),
  );
  app.init();
  await app.startAllMicroservices();
}
bootstrap();
