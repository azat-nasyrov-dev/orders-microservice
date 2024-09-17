import { Injectable } from '@nestjs/common';

@Injectable()
export class NotificationsMicroserviceService {
  getHello(): string {
    return 'Hello World!';
  }
}
