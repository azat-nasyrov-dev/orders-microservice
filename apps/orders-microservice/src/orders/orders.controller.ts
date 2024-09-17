import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderEntity } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

@ApiBearerAuth()
@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiOperation({ summary: 'Create order' })
  @ApiResponse({ status: 201, description: 'The order has been successfully created' })
  @Post()
  public async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderEntity> {
    return await this.ordersService.createOrder(createOrderDto);
  }

  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Return all orders' })
  @Get()
  public async getAllOrders(): Promise<OrderEntity[]> {
    return await this.ordersService.getAllOrders();
  }

  @ApiOperation({ summary: 'Get particular order' })
  @ApiResponse({ status: 200, description: 'Return particular order' })
  @Get(':id')
  public async getOrderById(@Param('id') id: string): Promise<OrderEntity | null> {
    return await this.ordersService.getOrderById(id);
  }

  @ApiOperation({ summary: 'Update particular order' })
  @ApiResponse({ status: 200, description: 'The order has been successfully updated' })
  @Put(':id')
  public async updateOrderById(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<OrderEntity | null> {
    return await this.ordersService.updateOrderById(id, updateOrderDto);
  }

  @ApiOperation({ summary: 'Delete particular order' })
  @ApiResponse({ status: 200, description: 'The order has been successfully deleted' })
  @Delete(':id')
  public async removeOrderById(@Param('id') id: string): Promise<OrderEntity> {
    return await this.ordersService.removeOrderById(id);
  }
}
