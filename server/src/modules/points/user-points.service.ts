import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPoints } from './user-points.entity';
import { PointsTransaction } from './points-transaction.entity';

@Injectable()
export class UserPointsService {
  constructor(
    @InjectRepository(UserPoints)
    private readonly userPointsRepository: Repository<UserPoints>,
    @InjectRepository(PointsTransaction)
    private readonly pointsTransactionRepository: Repository<PointsTransaction>,
  ) {}

  async findOrCreateUserPoints(userId: string): Promise<UserPoints> {
    let userPoints = await this.userPointsRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!userPoints) {
      userPoints = this.userPointsRepository.create({
        user: { id: userId } as any,
        points: 0,
        totalEarned: 0,
        totalSpent: 0,
      });
      await this.userPointsRepository.save(userPoints);
    }

    return userPoints;
  }

  async getUserPoints(userId: string): Promise<number> {
    const userPoints = await this.findOrCreateUserPoints(userId);
    return userPoints.points;
  }

  async addPoints(
    userId: string,
    points: number,
    type: string,
    description: string,
    orderId?: string,
  ): Promise<void> {
    const queryRunner = this.userPointsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 更新用户积分
      const userPoints = await this.findOrCreateUserPoints(userId);
      userPoints.points += points;
      userPoints.totalEarned += points;
      await queryRunner.manager.save(userPoints);

      // 创建交易记录
      const transaction = this.pointsTransactionRepository.create({
        user: { id: userId } as any,
        points,
        type,
        description,
        orderId,
        status: 'success',
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async deductPoints(
    userId: string,
    points: number,
    type: string,
    description: string,
    articleId?: string,
  ): Promise<boolean> {
    const queryRunner = this.userPointsRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userPoints = await this.findOrCreateUserPoints(userId);
      
      // 检查积分是否足够
      if (userPoints.points < points) {
        return false;
      }

      // 扣除积分
      userPoints.points -= points;
      userPoints.totalSpent += points;
      await queryRunner.manager.save(userPoints);

      // 创建交易记录
      const transaction = this.pointsTransactionRepository.create({
        user: { id: userId } as any,
        points: -points,
        type,
        description,
        article: articleId ? { id: articleId } as any : null,
        status: 'success',
      });
      await queryRunner.manager.save(transaction);

      await queryRunner.commitTransaction();
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactionHistory(userId: string): Promise<PointsTransaction[]> {
    return this.pointsTransactionRepository.find({
      where: { user: { id: userId } },
      relations: ['article'],
      order: { createAt: 'DESC' },
    });
  }
}