import { Logger as NestLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { config } from '@/config';

import { middleware } from './app.middleware';
import { AppModule } from './app.module';

async function bootstrap(): Promise<string> {
  // Nest App
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Base url at /api
  app.setGlobalPrefix('api', { exclude: ['public'] });

  // Exception filters
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // Add some middlewares
  middleware(app);

  // Swagger
  const options = new DocumentBuilder()
    .setTitle(config.swagger.title)
    .setDescription(config.swagger.description)
    .setVersion(config.swagger.version)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  app.enableShutdownHooks();

  // Start the app
  await app.listen(config.app.port);
  NestLogger.log(`API listening on port ${config.app.port}`);
  return app.getUrl();
}

(async (): Promise<void> => {
  try {
    const url = await bootstrap();
    NestLogger.log(`API up at: ${url}`, 'Server');
  } catch (error) {
    NestLogger.error(error, 'Server');
  }
})();
