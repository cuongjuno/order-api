import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Order')
    .setDescription('The Order API description')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser(process.env.APP_SECRET));
  app.use(
    session({
      secret: process.env.APP_SECRET as string,
      resave: false,
      saveUninitialized: false,
      store: new session.MemoryStore(),
      cookie: {
        httpOnly: true,
        signed: true,
        sameSite: 'strict',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/) ?? '*',
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  await app.listen(3006);
}
bootstrap();
