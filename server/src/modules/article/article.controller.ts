import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Article } from './article.entity';
import { ArticleService } from './article.service';
import { ArticlePurchaseService } from './article-purchase.service';
import { UserMembershipService } from '../membership/user-membership.service';
import { UserPointsService } from '../points/user-points.service';

@ApiTags('Article')
@Controller('article')
@UseGuards(RolesGuard)
export class ArticleController {
  constructor(
    private readonly articleService: ArticleService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly userMembershipService: UserMembershipService,
    private readonly userPointsService: UserPointsService,
    private readonly articlePurchaseService: ArticlePurchaseService
  ) {}

  /**
   * 创建文章
   * @param article
   */
  @ApiResponse({ status: 200, description: '创建文章', type: [Article] })
  @Post()
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  create(@Body() article) {
    return this.articleService.create(article);
  }

  /**
   * 获取所有文章
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() queryParams) {
    return this.articleService.findAll(queryParams);
  }

  /**
   * 获取标签下所有文章
   */
  @Get('/category/:id')
  @HttpCode(HttpStatus.OK)
  findArticlesByCategory(@Param('id') category, @Query() queryParams) {
    return this.articleService.findArticlesByCategory(category, queryParams);
  }

  /**
   * 获取标签下所有文章
   */
  @Get('/tag/:id')
  @HttpCode(HttpStatus.OK)
  findArticlesByTag(@Param('id') tag, @Query() queryParams) {
    return this.articleService.findArticlesByTag(tag, queryParams);
  }

  /**
   * 获取所有推荐文章
   */
  @Get('/all/recommend')
  @HttpCode(HttpStatus.OK)
  getRecommendArticles() {
    return this.articleService.getRecommendArticles();
  }

  /**
   * 获取所有文章归档
   */
  @Get('/archives')
  @HttpCode(HttpStatus.OK)
  getArchives(): Promise<{ [key: string]: Article[] }> {
    return this.articleService.getArchives();
  }

  /**
   * 获取相应文章的推荐文章
   */
  @Get('/recommend')
  @HttpCode(HttpStatus.OK)
  recommend(@Query('articleId') articleId) {
    return this.articleService.recommend(articleId);
  }

  /**
   * 获取指定文章
   * @param id
   */
  @Get(':id')
  async findById(@Request() req, @Param('id') id, @Query('status') status) {
    let token = req.headers.authorization;

    if (/Bearer/.test(token)) {
      // 不需要 Bearer，否则验证失败
      token = token.split(' ').pop();
    }

    try {
      const tokenUser = this.jwtService.decode(token) as User;
      const userId = tokenUser.id;
      const user = await this.userService.findById(userId);
      
      // 如果是管理员，直接返回完整文章
      if (user.role === 'admin') {
        return this.articleService.findById(id, status, true);
      }

      // 获取文章信息
      const article = await this.articleService.findById(id, status);

      // 检查用户会员状态
      const membership = await this.userMembershipService.findActiveByUser(userId);
      const isMember = membership && membership.isActive;

      // 检查用户是否购买过该文章
      const hasPurchased = await this.articlePurchaseService.checkPurchased(userId, id);

      // 如果是会员或已解锁，返回完整文章
      if (isMember || hasPurchased) {
        return article;
      }

      // 否则返回受限内容
      return {
        ...article,
        content: '您未解锁该文章，请充值会员或购买',
        isLocked: true
      };
      
    } catch (e) {
      // 未登录用户返回受限内容
      const article = await this.articleService.findById(id, status);
      return {
        ...article,
        content: '您未解锁该文章，请充值会员或购买',
        isLocked: true
      };
    }
  }

  /**
   * 校验文章密码
   * @param id
   * @param article
   */
  @Post(':id/checkPassword')
  @HttpCode(HttpStatus.OK)
  checkPassword(@Param('id') id, @Body() article) {
    return this.articleService.checkPassword(id, article);
  }

  /**
   * 文章访问量 +1
   */
  @Post(':id/views')
  @HttpCode(HttpStatus.OK)
  updateViewsById(@Param('id') id) {
    return this.articleService.updateViewsById(id);
  }

  /**
   * 文章访问量 +1
   */
  @Post(':id/likes')
  @HttpCode(HttpStatus.OK)
  updateLikesById(@Param('id') id, @Body('type') type) {
    return this.articleService.updateLikesById(id, type);
  }

  /**
   * 更新文章
   * @param id
   * @param article
   */
  @Patch(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  updateById(@Param('id') id, @Body() article) {
    return this.articleService.updateById(id, article);
  }

  /**
   * 删除文章
   * @param id
   */
  @Delete(':id')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.articleService.deleteById(id);
  }

  /**
   * 使用积分购买文章
   */
  @Post(':id/purchase')
  @UseGuards(JwtAuthGuard)
  async purchaseArticle(
    @Request() req,
    @Param('id') articleId: string,
    @Body('points') points: number,
  ) {
    const token = req.headers.authorization.split(' ').pop();
    const tokenUser = this.jwtService.decode(token) as User;
    
    try {
      const purchase = await this.articlePurchaseService.purchaseWithPoints(
        tokenUser.id,
        articleId,
        points
      );
      return {
        success: true,
        message: '购买成功',
        data: purchase
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}
