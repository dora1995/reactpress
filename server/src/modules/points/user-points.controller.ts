import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserPointsService } from './user-points.service';
import { PointsTransaction } from './points-transaction.entity';

@ApiTags('用户积分')
@Controller('user-points')
export class UserPointsController {
  constructor(private readonly userPointsService: UserPointsService) {}

  @ApiOperation({ summary: '获取用户积分余额' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async getUserPoints(@Param('userId') userId: string): Promise<number> {
    return this.userPointsService.getUserPoints(userId);
  }

  @ApiOperation({ summary: '增加用户积分' })
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async addPoints(
    @Body()
    data: {
      userId: string;
      points: number;
      type: string;
      description: string;
      orderId?: string;
    },
  ): Promise<void> {
    if (data.points <= 0) {
      throw new BadRequestException('积分必须大于0');
    }
    return this.userPointsService.addPoints(
      data.userId,
      data.points,
      data.type,
      data.description,
      data.orderId,
    );
  }

  @ApiOperation({ summary: '扣除用户积分' })
  @UseGuards(JwtAuthGuard)
  @Post('deduct')
  async deductPoints(
    @Body()
    data: {
      userId: string;
      points: number;
      type: string;
      description: string;
      articleId?: string;
    },
  ): Promise<boolean> {
    if (data.points <= 0) {
      throw new BadRequestException('积分必须大于0');
    }
    return this.userPointsService.deductPoints(
      data.userId,
      data.points,
      data.type,
      data.description,
      data.articleId,
    );
  }

  @ApiOperation({ summary: '获取用户积分交易记录' })
  @UseGuards(JwtAuthGuard)
  @Get('transactions/:userId')
  async getTransactionHistory(
    @Param('userId') userId: string,
  ): Promise<PointsTransaction[]> {
    return this.userPointsService.getTransactionHistory(userId);
  }
}