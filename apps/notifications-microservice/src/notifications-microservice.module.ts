import { Module } from '@nestjs/common';
import { NotificationsMicroserviceController } from './notifications-microservice.controller';
import { NotificationsMicroserviceService } from './notifications-microservice.service';

@Module({
  imports: [],
  controllers: [NotificationsMicroserviceController],
  providers: [NotificationsMicroserviceService],
})
export class NotificationsMicroserviceModule {}
