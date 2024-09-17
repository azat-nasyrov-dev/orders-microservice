import { IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsUUID()
  readonly userId: string;

  @IsNotEmpty()
  @IsUUID()
  readonly productId: string;

  @IsNotEmpty()
  @IsInt()
  readonly quantity: number;
}
