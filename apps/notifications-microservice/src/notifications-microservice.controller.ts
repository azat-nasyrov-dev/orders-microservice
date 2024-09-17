import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class NotificationsMicroserviceController {
  private readonly logger = new Logger(NotificationsMicroserviceController.name);

  @EventPattern('order.created')
  public async handleOrderCreated(data: Record<string, unknown>) {
    this.logger.debug(`Received new "order.created" event: ${JSON.stringify(data)}`);
  }

  @EventPattern('order.updated')
  public async handleOrderUpdated(data: Record<string, unknown>) {
    this.logger.debug(`Received new "order.updated" event: ${JSON.stringify(data)}`);
  }
}
