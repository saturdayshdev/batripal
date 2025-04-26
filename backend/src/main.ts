import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Accept,Authorization',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: false,
  });
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(4040);
}
bootstrap();
