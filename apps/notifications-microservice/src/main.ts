import { NestFactory } from '@nestjs/core';
import { NotificationsMicroserviceModule } from './notifications-microservice.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsMicroserviceModule);
  await app.listen(3000);
}
bootstrap();
