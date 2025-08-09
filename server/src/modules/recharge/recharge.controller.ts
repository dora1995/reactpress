import { Controller, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
import { RechargeService } from './recharge.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('recharge')
@UseGuards(JwtAuthGuard)
export class RechargeController {
  constructor(private readonly rechargeService: RechargeService) {}

  @Post('points')
  async rechargePoints(
    @Request() req,
    @Body() body: { points: number; payType: string },
  ) {
    try {
      const result = await this.rechargeService.createPointsRecharge({
        userId: req.user.id,
        points: body.points,
        payType: body.payType,
      });

      return {
        code: 200,
        data: result,
        message: '创建充值订单成功',
      };
    } catch (error) {
      throw new HttpException({
        code: 400,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('membership')
  async rechargeMembership(
    @Request() req,
    @Body() body: { planType: string; payType: string },
  ) {
    try {
      const result = await this.rechargeService.createMembershipRecharge({
        userId: req.user.id,
        planType: body.planType,
        payType: body.payType,
      });

      return {
        code: 200,
        data: result,
        message: '创建会员订单成功',
      };
    } catch (error) {
      throw new HttpException({
        code: 400,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('complete')
  async completeRecharge(
    @Request() req,
    @Body() body: { redisKey: string },
  ) {
    try {
      const result = await this.rechargeService.completeRecharge({
        userId: req.user.id,
        redisKey: body.redisKey,
      });

      return {
        code: 200,
        data: result,
        message: '充值完成',
      };
    } catch (error) {
      throw new HttpException({
        code: 400,
        message: error.message,
      }, HttpStatus.BAD_REQUEST);
    }
  }
}