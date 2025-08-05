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
import { UserMembershipService } from './user-membership.service';
import { UserMembership } from './user-membership.entity';

@ApiTags('用户会员')
@Controller('user-membership')
export class UserMembershipController {
  constructor(private readonly userMembershipService: UserMembershipService) {}

  @ApiOperation({ summary: '获取用户的会员记录' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId')
  async findByUser(@Param('userId') userId: string): Promise<UserMembership[]> {
    return this.userMembershipService.findByUser(userId);
  }

  @ApiOperation({ summary: '获取用户当前有效的会员' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/active')
  async findActiveByUser(@Param('userId') userId: string): Promise<UserMembership | null> {
    return this.userMembershipService.findActiveByUser(userId);
  }

  @ApiOperation({ summary: '检查用户是否是会员' })
  @UseGuards(JwtAuthGuard)
  @Get('user/:userId/check')
  async checkUserMembership(@Param('userId') userId: string): Promise<boolean> {
    return this.userMembershipService.checkUserMembership(userId);
  }

  @ApiOperation({ summary: '为用户开通/续费会员' })
  @UseGuards(JwtAuthGuard)
  @Post('extend')
  async extendMembership(
    @Body() data: { userId: string; membershipTypeId: string; startAt?: Date },
  ): Promise<UserMembership> {
    return this.userMembershipService.extendMembership(
      data.userId,
      data.membershipTypeId,
      data.startAt,
    );
  }
}