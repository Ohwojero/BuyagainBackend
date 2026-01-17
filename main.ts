import { NestFactory } from '@nestjs/core';
import { ValidationPipe, HttpException, HttpStatus } from '@nestjs/common';
import { AppModule } from './src/app.module';
import { GlobalExceptionFilter } from './src/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // Global exception filter for JSON responses
  app.useGlobalFilters(new GlobalExceptionFilter());

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
  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);

  console.log(`Backend server running on port ${port}`);
}

bootstrap();
