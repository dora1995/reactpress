import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMembership } from './user-membership.entity';
import { UserMembershipService } from './user-membership.service';
import { UserMembershipController } from './user-membership.controller';
import { MembershipTypeModule } from './membership-type.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserMembership]),
    MembershipTypeModule,
    AuthModule,
  ],
  providers: [UserMembershipService],
  controllers: [UserMembershipController],
  exports: [UserMembershipService],
})
export class UserMembershipModule {}