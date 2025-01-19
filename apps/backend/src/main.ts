import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });

  const configService = app.get(ConfigService);

  const cookieSecret = configService.getOrThrow<string>('COOKIE_SECRET');
  app.use(cookieParser([cookieSecret]));

  await app.listen(3001);
}
bootstrap();
