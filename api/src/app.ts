import { Logger as NestLogger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // middleware(app);

  app.enableShutdownHooks();
  await app.listen(process.env.PORT || 8081);

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
