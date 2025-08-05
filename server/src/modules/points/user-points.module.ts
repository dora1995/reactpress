import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPoints } from './user-points.entity';
import { PointsTransaction } from './points-transaction.entity';
import { UserPointsService } from './user-points.service';
import { UserPointsController } from './user-points.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPoints, PointsTransaction]),
    AuthModule,
  ],
  providers: [UserPointsService],
  controllers: [UserPointsController],
  exports: [UserPointsService],
})
export class UserPointsModule {}