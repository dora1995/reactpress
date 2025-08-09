import { Module } from '@nestjs/common';
import { RechargeService } from './recharge.service';
import { RechargeController } from './recharge.controller';
import { PaymentModule } from '../payment/payment.module';
import { UserPointsModule } from '../points/user-points.module';
import { UserMembershipModule } from '../membership/user-membership.module';
import { MembershipTypeModule } from '../membership/membership-type.module';

@Module({
  imports: [
    PaymentModule,
    UserPointsModule,
    UserMembershipModule,
    MembershipTypeModule,
  ],
  providers: [RechargeService],
  controllers: [RechargeController],
})
export class RechargeModule {}