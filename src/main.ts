import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://telegram-mini-casino.vercel.app',
      'http://localhost:5173/',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'Accept',
      'Origin',
      'User-Agent',
      'Cache-Control',
      'Pragma',
    ],
    credentials: true,
    optionsSuccessStatus: 200,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
