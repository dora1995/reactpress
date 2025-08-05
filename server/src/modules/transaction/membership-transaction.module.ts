import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipTransaction } from './membership-transaction.entity';
import { MembershipTransactionService } from './membership-transaction.service';
import { MembershipTransactionController } from './membership-transaction.controller';
import { UserMembershipModule } from '../membership/user-membership.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipTransaction]),
    UserMembershipModule,
    AuthModule,
  ],
  providers: [MembershipTransactionService],
  controllers: [MembershipTransactionController],
  exports: [MembershipTransactionService],
})
export class MembershipTransactionModule {}