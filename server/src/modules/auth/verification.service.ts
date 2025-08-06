import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { sendEmailCode } from '../../utils/sms';

@Injectable()
export class VerificationService {
  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: any,
  ) {}

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendVerificationCode(email: string): Promise<boolean> {
    const code = this.generateVerificationCode();
    const key = `verification:${email}`;
    
    try {
      // 发送验证码
      await sendEmailCode(email, code);
      // 将验证码存入 Redis，设置 5 分钟过期
      await this.cacheManager.set(key, code, 300);
      
      return true;
    } catch (error) {
      console.error('发送验证码失败:', error);
      return false;
    }
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const key = `verification:${email}`;
    const storedCode = await this.cacheManager.get(key) as string;
    
    if (!storedCode) {
      return false; // 验证码不存在或已过期
    }

    if (storedCode === code) {
      // 验证成功后删除验证码
      await this.cacheManager.del(key);
      return true;
    }

    return false;
  }
}