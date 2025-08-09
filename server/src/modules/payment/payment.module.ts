import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/common';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    CacheModule.register({
      ttl: 60 * 60 * 24, // 24小时缓存
    }),
  ],
  providers: [PaymentService],
  controllers: [PaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}