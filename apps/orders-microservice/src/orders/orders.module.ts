import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { OrderEntity } from './entities/order.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { NOTIFICATIONS_MICROSERVICE } from './constants';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: NOTIFICATIONS_MICROSERVICE,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'notifications-microservice',
        },
      },
    ]),
    TypeOrmModule.forFeature([UserEntity, ProductEntity, OrderEntity]),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
