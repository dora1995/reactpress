import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.guard';
import { VerificationService } from './verification.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly verificationService: VerificationService,
  ) {}

  /**
   * 用户登录
   * @param user
   */
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() user) {
    const res = await this.authService.login(user);
    return res;
  }

  @Post('admin')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  createBook() {
    return this.authService.checkAdmin();
  }

  @Post('github')
  loginWithGithub(@Body('code') code) {
    return this.authService.loginWithGithub(code);
  }

  /**
   * 发送邮箱验证码
   */
  @Post('/send-code')
  @HttpCode(HttpStatus.OK)
  async sendVerificationCode(@Body('email') email: string) {
    const success = await this.verificationService.sendVerificationCode(email);
    if (success) {
      return { message: '验证码已发送' };
    }
    return { message: '验证码发送失败', statusCode: HttpStatus.INTERNAL_SERVER_ERROR };
  }

  /**
   * 验证邮箱验证码并登录/注册
   */
  @Post('/verify-code')
  @HttpCode(HttpStatus.OK)
  async verifyCode(@Body() data: { email: string; code: string }) {
    const { email, code } = data;
    const isValid = await this.verificationService.verifyCode(email, code);
    
    if (!isValid) {
      return { message: '验证码无效或已过期', statusCode: HttpStatus.BAD_REQUEST };
    }

    // 验证成功，执行登录或注册
    return this.authService.loginOrRegisterWithEmail(email);
  }
}
