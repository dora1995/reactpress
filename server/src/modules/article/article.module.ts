import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';
import { UserModule } from '../user/user.module';
import { UserPointsModule } from '../points/user-points.module';
import { UserMembershipModule } from '../membership/user-membership.module';
import { ArticleController } from './article.controller';
import { Article } from './article.entity';
import { ArticlePurchase } from './article-purchase.entity';
import { ArticleService } from './article.service';
import { ArticlePurchaseService } from './article-purchase.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticlePurchase]), 
    CategoryModule, 
    TagModule, 
    UserModule, 
    AuthModule,
    UserPointsModule,
    UserMembershipModule
  ],
  exports: [ArticleService, ArticlePurchaseService],
  providers: [ArticleService, ArticlePurchaseService],
  controllers: [ArticleController],
})
export class ArticleModule {}
