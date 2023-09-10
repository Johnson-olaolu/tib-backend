import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  const config = new DocumentBuilder()
    .setTitle('TIB API')
    .setDescription('TIB API Documentation')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    `documentation/${app.get(ConfigService).get('VERSION')}`,
    app,
    document,
  );
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(`api/${app.get(ConfigService).get('VERSION')}`);
  await app.listen(app.get(ConfigService).get('PORT') || 3000);
}
bootstrap();
