import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentService {
  private readonly payConfig: {
    pid: string;
    notify_url: string;
    api_url: string;
    key: string;
  };

  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @Inject(CACHE_MANAGER)
    private cacheManager: any,
    private configService: ConfigService,
  ) {
    this.payConfig = {
      pid: this.configService.get<string>('PAY_PID'),
      notify_url: this.configService.get<string>('PAY_NOTIFY_URL'),
      api_url: 'https://zpayz.cn/mapi.php',
      key: this.configService.get<string>('PAY_KEY'),
    };
  }

  private generateSign(params: any): string {
    const sortedKeys = Object.keys(params).sort();
    let signStr = '';
    sortedKeys.forEach((key) => {
      if (key !== 'sign' && key !== 'sign_type' && params[key] !== '') {
        signStr += `${key}=${params[key]}&`;
      }
    });
    signStr += `key=${this.payConfig.key}`;
    return crypto.createHash('md5').update(signStr).digest('hex');
  }

  async createPayment(params: {
    amount: number;
    title: string;
    redisKey: string;
    payType: string;
    metadata?: any;
  }) {
    const orderId = uuidv4();
    const payParams = {
      pid: this.payConfig.pid,
      type: params.payType,
      out_trade_no: orderId,
      notify_url: this.payConfig.notify_url,
      name: params.title,
      money: params.amount.toFixed(2),
      device: 'pc',
      param: JSON.stringify(params.metadata || {}),
      sign_type: 'MD5',
    };
    // 生成签名
    const sign = this.generateSign(payParams);
    try {
      // 调用支付接口
      const formData = new URLSearchParams();
      Object.entries({ ...payParams, sign }).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      const response: any = await axios.post(this.payConfig.api_url, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.data.code === 1) {
        // 创建支付记录
        const payment = this.paymentRepository.create({
          orderId,
          amount: params.amount,
          title: params.title,
          redisKey: params.redisKey,
          status: 'pending',
          payType: params.payType,
          payUrl: response.data.payurl,
          qrcode: response.data.qrcode,
          metadata: params.metadata,
        });

        await this.paymentRepository.save(payment);

        // 保存到Redis，设置30分钟过期
        await this.cacheManager.set(
          params.redisKey,
          JSON.stringify({
            orderId,
            status: 'pending',
            amount: params.amount,
            metadata: params.metadata,
          }),
          { ttl: 1800 }
        );

        return {
          orderId,
          payUrl: response.data.payurl,
          qrcode: response.data.qrcode,
        };
      } else {
        throw new Error(response.data.msg || '支付创建失败');
      }
    } catch (error) {
      throw new Error(`创建支付失败: ${error.message}`);
    }
  }

  async handlePaymentCallback(params: any) {
    // 验证签名
    const sign = params.sign;
    delete params.sign;
    const calculatedSign = this.generateSign(params);

    if (sign !== calculatedSign) {
      throw new Error('签名验证失败');
    }

    const payment = await this.paymentRepository.findOne({
      where: { orderId: params.out_trade_no },
    });

    if (!payment) {
      throw new Error('支付订单不存在');
    }

    if (payment.status === 'success') {
      return true; // 已处理过的订单直接返回成功
    }

    // 更新支付状态
    payment.status = 'success';
    payment.updatedAt = new Date();
    await this.paymentRepository.save(payment);

    // 更新Redis中的状态
    const orderData = await this.cacheManager.get(payment.redisKey);
    
    if (orderData) {
      const data = JSON.parse(orderData);
      data.status = 'success';
      await this.cacheManager.set(payment.redisKey, JSON.stringify(data), { ttl: 1800 });
    }

    return true;
  }

  async getPaymentStatus(redisKey: string) {
    const orderData = await this.cacheManager.get(redisKey);
    
    if (!orderData) {
      throw new Error('订单不存在或已过期');
    }

    return JSON.parse(orderData);
  }
}