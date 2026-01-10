import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './src/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://buy-again-ng.vercel.app',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Railway injects PORT automatically
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`Backend server running on port ${port}`);
}

bootstrap();
