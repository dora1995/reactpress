import { Injectable } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import { UserPointsService } from '../points/user-points.service';
import { UserMembershipService } from '../membership/user-membership.service';
import { v4 as uuidv4 } from 'uuid';
import { MembershipTypeService } from '../membership/membership-type.service';

@Injectable()
export class RechargeService {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userPointsService: UserPointsService,
    private readonly userMembershipService: UserMembershipService,
    private readonly membershipTypeService: MembershipTypeService,
  ) {}

  async createPointsRecharge(params: {
    userId: number;
    points: number;
    payType: string;
  }) {

    // 十积分一块钱
    const plan = {
      price: params.points * 0.1,
      points: params.points,
    }
    const redisKey = `recharge:points:${uuidv4()}`;
    
    // 创建支付
    const paymentResult = await this.paymentService.createPayment({
      amount: plan.price,
      title: `充值${plan.points}积分`,
      redisKey,
      payType: params.payType,
      metadata: {
        userId: params.userId,
        type: 'points',
        points: plan.points,
      },
    });

    return {
      ...paymentResult,
      redisKey,
    };
  }

  async createMembershipRecharge(params: {
    userId: number;
    planType: string;
    payType: string;
  }) {
    // 获取会员套餐信息
    const plan = await this.getMembershipPlan(params.planType);
    if (!plan) {
      throw new Error('无效的套餐类型');
    }

    const redisKey = `recharge:membership:${uuidv4()}`;
    
    // 创建支付
    const paymentResult = await this.paymentService.createPayment({
      amount: plan.price,
      title: `购买${plan.name}`,
      redisKey,
      payType: params.payType,
      metadata: {
        userId: params.userId,
        type: 'membership',
        planType: params.planType,
        duration: plan.duration,
      },
    });

    return {
      ...paymentResult,
      redisKey,
    };
  }

  async completeRecharge(params: {
    userId: number;
    redisKey: string;
  }) {
    // 获取支付状态
    const paymentStatus = await this.paymentService.getPaymentStatus(params.redisKey);
    
    if (paymentStatus.status !== 'success') {
      throw new Error('支付未完成');
    }

    const { type, planType, userId, points, duration } = paymentStatus.metadata;
    
    if (userId !== params.userId) {
      throw new Error('用户信息不匹配');
    }

    // 根据充值类型处理不同的逻辑
    if (type === 'points') {
      await this.userPointsService.addPoints(userId, points, points + '', '积分充值', paymentStatus.orderId);
    } else if (type === 'membership') {
      await this.userMembershipService.extendMembership(userId, planType, new Date(Date.now() + duration * 24 * 60 * 60 * 1000));
    }

    return {
      message: '充值完成',
    };
  } 

  private async getMembershipPlan(typeId: string) {
    // 会员套餐从数据库获取
    const membershipPlan = await this.membershipTypeService.findOne(typeId);
    return {
      price: membershipPlan.price,
      name: membershipPlan.name,
      duration: membershipPlan.duration,
    };
  }
}