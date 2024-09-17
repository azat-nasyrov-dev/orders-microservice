import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { OrderEntity } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UserEntity } from './entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { NOTIFICATIONS_MICROSERVICE } from './constants';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @Inject(NOTIFICATIONS_MICROSERVICE)
    private readonly rabbitClient: ClientProxy,
    private readonly dataSource: DataSource,
  ) {}

  public async createOrder(createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { userId, productId, quantity } = createOrderDto;

      const userRepository = queryRunner.manager.getRepository(UserEntity);
      const productRepository = queryRunner.manager.getRepository(ProductEntity);
      const orderRepository = queryRunner.manager.getRepository(OrderEntity);

      const user = await userRepository.findOneBy({ id: userId });
      const product = await productRepository.findOneBy({ id: productId });

      if (!user || !product) {
        throw new HttpException('User or Product not found', HttpStatus.NOT_FOUND);
      }

      const totalPrice = product.price * quantity;

      const order = orderRepository.create({
        user,
        product,
        quantity,
        totalPrice,
        status: 'created',
      });

      const savedOrder = await orderRepository.save(order);
      await queryRunner.commitTransaction();
      this.rabbitClient.emit('order.created', savedOrder);

      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to create order', err.stack);
      throw new HttpException(
        'Failed to create order, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await queryRunner.release();
    }
  }

  public async getAllOrders(): Promise<OrderEntity[]> {
    try {
      return await this.orderRepository.find({ relations: ['user', 'product'] });
    } catch (err) {
      this.logger.error('Failed to fetch orders', err.stack);
      throw new HttpException(
        'Failed to fetch orders, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getOrderById(id: string): Promise<OrderEntity | null> {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
        relations: ['user', 'product'],
      });

      if (!order) {
        throw new HttpException(`Order with #${id} not found`, HttpStatus.NOT_FOUND);
      }

      return order;
    } catch (err) {
      this.logger.error('Failed to fetch particular order', err.stack);
      throw new HttpException(
        'Failed to fetch particular order, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async updateOrderById(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderEntity> {
    try {
      const order = await this.getOrderById(id);
      const { quantity, status } = updateOrderDto;

      if (quantity) {
        order.quantity = quantity;
        order.totalPrice = order.product.price * quantity;
      }

      if (status) {
        order.status = status;
      }

      const updatedOrder = await this.orderRepository.save(order);
      this.rabbitClient.emit('order.updated', updatedOrder);

      return updatedOrder;
    } catch (err) {
      this.logger.error('Failed to update particular order', err.stack);
      throw new HttpException(
        'Failed to update particular order, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async removeOrderById(id: string): Promise<OrderEntity> {
    try {
      const order = await this.getOrderById(id);
      return await this.orderRepository.remove(order);
    } catch (err) {
      this.logger.error('Failed to delete particular order', err.stack);
      throw new HttpException(
        'Failed to delete particular order, please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
