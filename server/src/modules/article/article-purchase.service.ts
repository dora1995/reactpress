import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticlePurchase } from './article-purchase.entity';
import { UserPointsService } from '../points/user-points.service';
import { ArticleService } from './article.service';

@Injectable()
export class ArticlePurchaseService {
  constructor(
    @InjectRepository(ArticlePurchase)
    private readonly articlePurchaseRepository: Repository<ArticlePurchase>,
    private readonly userPointsService: UserPointsService,
    private readonly articleService: ArticleService,
  ) {}

  /**
   * 检查用户是否已购买文章
   */
  async checkPurchased(userId: string, articleId: string): Promise<boolean> {
    const purchase = await this.articlePurchaseRepository.findOne({
      where: { userId, articleId },
    });
    return !!purchase;
  }

  /**
   * 使用积分购买文章
   */
  async purchaseWithPoints(userId: string, articleId: string, points: number): Promise<ArticlePurchase> {
    // 检查文章是否存在
    const article = await this.articleService.findById(articleId);
    if (!article) {
      throw new Error('文章不存在');
    }

    // 检查是否已购买
    const purchased = await this.checkPurchased(userId, articleId);
    if (purchased) {
      throw new Error('您已经购买过此文章');
    }

    // 扣除用户积分
    const deducted = await this.userPointsService.deductPoints(
      userId,
      points,
      'article_purchase',
      '购买文章',
      articleId.toString()
    );

    if (!deducted) {
      throw new Error('积分不足');
    }

    // 创建购买记录
    const purchase = this.articlePurchaseRepository.create({
      userId,
      articleId,
      pointsUsed: points,
    });

    return this.articlePurchaseRepository.save(purchase);
  }

  /**
   * 获取用户购买的所有文章
   */
  async getUserPurchases(userId: number) {
    return this.articlePurchaseRepository.find({
      where: { userId },
      relations: ['article'],
      order: { purchaseDate: 'DESC' },
    });
  }
}