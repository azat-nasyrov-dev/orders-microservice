import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsInt()
  readonly quantity?: number;

  @IsOptional()
  @IsString()
  readonly status?: string;
}
