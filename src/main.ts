import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DuplicateKeyExceptionFilter } from './filters/duplicate.filter';
import { InternalServerErrorExceptionFilter } from './filters/internal-server-error.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(
    new DuplicateKeyExceptionFilter(),
    new InternalServerErrorExceptionFilter(),
  );

  const config = new DocumentBuilder()
    .setTitle('Health Confy')
    .setDescription('This is api documentation for health confy.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
