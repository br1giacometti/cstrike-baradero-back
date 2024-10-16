import { NestFactory } from '@nestjs/core';
import { AppModule } from 'Base/module/AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://cstrike-baradero-front.vercel.app',
      'https://cstrike-baradero-front.vercel.app',
      'https://cstrike-baradero-front.vercel.app/',
      'https://cstrike-baradero-front.vercel.app/',
      'https://cstrike-baradero-front.vercel.app',
      'https://www.csbaradero.com.ar/',
      'https://www.csbaradero.com.ar',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
  console.log(`Kiosking is running on ${process.env.PORT || 3000}`);
}

bootstrap();
