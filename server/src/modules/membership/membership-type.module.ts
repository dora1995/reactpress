import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MembershipType } from './membership-type.entity';
import { MembershipTypeService } from './membership-type.service';
import { MembershipTypeController } from './membership-type.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipType]),
    AuthModule,
  ],
  providers: [MembershipTypeService],
  controllers: [MembershipTypeController],
  exports: [MembershipTypeService],
})
export class MembershipTypeModule {}