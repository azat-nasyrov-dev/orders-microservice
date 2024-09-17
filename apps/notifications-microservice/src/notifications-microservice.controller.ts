import { Controller, Get } from '@nestjs/common';
import { NotificationsMicroserviceService } from './notifications-microservice.service';

@Controller()
export class NotificationsMicroserviceController {
  constructor(private readonly notificationsMicroserviceService: NotificationsMicroserviceService) {}

  @Get()
  getHello(): string {
    return this.notificationsMicroserviceService.getHello();
  }
}
