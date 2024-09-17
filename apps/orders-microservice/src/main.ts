import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],
        queue: 'orders-microservice',
      },
    },
    { inheritAppConfig: true },
  );

  const options = new DocumentBuilder()
    .setTitle('Orders-Microservice')
    .setDescription('Orders-Microservice Documentation')
    .setVersion('1.0')
    .setBasePath('/orders')
    .addBearerAuth()
    .addTag('Developed by Azat Nasyrov')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/orders/docs', app, document);

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
