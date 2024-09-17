import { Module } from '@nestjs/common';
import { NotificationsMicroserviceController } from './notifications-microservice.controller';
import { NotificationsMicroserviceService } from './notifications-microservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadEntities: true,
      synchronize: false,
    }),
  ],
  controllers: [NotificationsMicroserviceController],
  providers: [NotificationsMicroserviceService],
})
export class NotificationsMicroserviceModule {}
