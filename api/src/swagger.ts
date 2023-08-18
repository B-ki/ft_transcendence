import { NestFactory } from '@nestjs/core';
import { Logger as NestLogger } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<string> {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Transcendance API Documentation')
    .setDescription('The API documentation for the ft_transcendance website')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('', app, document);

  await app.listen(process.env.SWAGGER_PORT || 8082);

  return app.getUrl();
}

(async () => {
  try {
    const url = await bootstrap();
    NestLogger.log(`Swagger started at: ${url}`, 'Swagger');
  } catch (err) {
    NestLogger.error(err, 'Swagger');
  }
})();
