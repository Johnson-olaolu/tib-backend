import { NestFactory, Reflector } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseDto } from './utils/Response.dto';
import { RpcExceptionFilter } from './utils/rpc.exception';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.setGlobalPrefix(`api/${app.get(ConfigService).get('VERSION')}`);

  const config = new DocumentBuilder()
    .setTitle('TIB API')
    .setDescription('TIB API Documentation')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [ResponseDto],
  });
  SwaggerModule.setup(
    `documentation/${app.get(ConfigService).get('VERSION')}`,
    app,
    document,
  );
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new RpcExceptionFilter());
  await app.listen(app.get(ConfigService).get('PORT') || 3000);
}
bootstrap();
