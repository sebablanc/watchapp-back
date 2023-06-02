import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  let configSrv = new ConfigService();
  app.enableCors({
    origin: configSrv.get('ACCEPTED_ORIGIN')
  });
  app.use(cookieParser());
  await app.listen(configSrv.get('PORT'));
}
bootstrap();
