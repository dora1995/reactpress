import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/common';

import { SettingModule } from '../setting/setting.module';
import { SMTPModule } from '../smtp/smtp.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { VerificationService } from './verification.service';

const passModule = PassportModule.register({ defaultStrategy: 'jwt' });
const jwtModule = JwtModule.register({
  secret: 'reactpress',
  signOptions: { expiresIn: '4h' },
});

@Module({
  imports: [
    forwardRef(() => UserModule),
    passModule,
    jwtModule,
    forwardRef(() => SettingModule),
    forwardRef(() => SMTPModule),
    CacheModule.register({
      ttl: 300, // 默认缓存时间 5 分钟
      max: 100, // 最大缓存数量
    }),
  ],
  providers: [AuthService, JwtStrategy, VerificationService],
  controllers: [AuthController],
  exports: [passModule, jwtModule],
})
export class AuthModule {}
