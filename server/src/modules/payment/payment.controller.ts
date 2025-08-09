import { Controller, Post, Body, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('create')
  async createPayment(@Body() params: {
    amount: number;
    title: string;
    redisKey: string;
    payType: string;
    metadata?: any;
  }) {
    try {
      const result = await this.paymentService.createPayment(params);
      return {
        code: 200,
        data: result,
        message: '支付创建成功',
      };
    } catch (error) {
      throw new HttpException({
        code: 400,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('callback')
  async handleCallback(@Body() params: any) {
    try {
      await this.paymentService.handlePaymentCallback(params);
      return 'success';
    } catch (error) {
      throw new HttpException({
        code: 400,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('status')
  async getPaymentStatus(@Query('redisKey') redisKey: string) {
    try {
      const status = await this.paymentService.getPaymentStatus(redisKey);
      return {
        code: 200,
        data: status,
        message: '获取支付状态成功',
      };
    } catch (error) {
      throw new HttpException({
        code: 400,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}