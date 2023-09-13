import { NestFactory, Reflector } from '@nestjs/core';
import { FileServiceModule } from './file-service.module';
import { ConfigService } from '@nestjs/config';
import { RmqService } from '@app/rmq';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

export let app: NestExpressApplication;

async function bootstrap() {
  app = await NestFactory.create<NestExpressApplication>(FileServiceModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.connectMicroservice(rmqService.getOptions('FILE', true));
  await app.startAllMicroservices();
  await app.listen(app.get(ConfigService).get('PORT') || 3000);
}
bootstrap();
