import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  public async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  public async getAllOrders(): Promise<OrderEntity[]> {
    return await this.ordersService.getAllOrders();
  }

  @Get(':id')
  public async getOrderById(@Param('id') id: string): Promise<OrderEntity | null> {
    return await this.ordersService.getOrderById(id);
  }

  @Put(':id')
  public async updateOrderById(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity | null> {
    return await this.ordersService.updateOrderById(id, updateOrderDto);
  }

  @Delete(':id')
  public async removeOrderById(@Param('id') id: string): Promise<OrderEntity> {
    return await this.ordersService.removeOrderById(id);
  }
}
