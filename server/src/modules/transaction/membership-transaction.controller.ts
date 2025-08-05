import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MembershipTransactionService } from './membership-transaction.service';
import { MembershipTransaction } from './membership-transaction.entity';

@ApiTags('会员交易')
@Controller('membership-transaction')
export class MembershipTransactionController {
  constructor(
    private readonly transactionService: MembershipTransactionService,
  ) {}

  @ApiOperation({ summary: '获取用户的会员购买记录' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<MembershipTransaction[]> {
    return this.transactionService.findByUser(userId);
  }

  @ApiOperation({ summary: '创建会员购买交易' })
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createTransaction(
    @Body()
    data: {
      userId: string;
      membershipTypeId: string;
      amount: number;
      paymentMethod: string;
    },
  ): Promise<MembershipTransaction> {
    return this.transactionService.createTransaction(
      data.userId,
      data.membershipTypeId,
      data.amount,
      data.paymentMethod,
    );
  }

  @ApiOperation({ summary: '处理支付成功' })
  @Post('payment-success')
  async handlePaymentSuccess(
    @Body() data: { orderId: string; paymentTime?: Date },
  ): Promise<void> {
    await this.transactionService.handlePaymentSuccess(
      data.orderId,
      data.paymentTime,
    );
  }

  @ApiOperation({ summary: '处理支付失败' })
  @Post('payment-failure')
  async handlePaymentFailure(
    @Body() data: { orderId: string },
  ): Promise<void> {
    await this.transactionService.handlePaymentFailure(data.orderId);
  }
}