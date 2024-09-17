import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsMicroserviceController } from './notifications-microservice.controller';
import { NotificationsMicroserviceService } from './notifications-microservice.service';

describe('NotificationsMicroserviceController', () => {
  let notificationsMicroserviceController: NotificationsMicroserviceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NotificationsMicroserviceController],
      providers: [NotificationsMicroserviceService],
    }).compile();

    notificationsMicroserviceController = app.get<NotificationsMicroserviceController>(NotificationsMicroserviceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(notificationsMicroserviceController.getHello()).toBe('Hello World!');
    });
  });
});
