import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Article } from '../article/article.entity';

@Entity()
export class PointsTransaction {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty()
  @Column({ type: 'int' })
  points: number; // 积分数量（正数表示获得，负数表示消费）

  @ApiProperty()
  @Column('simple-enum', { 
    enum: ['purchase', 'article_read', 'system_grant', 'refund'],
    comment: '交易类型：购买积分、阅读文章、系统赠送、退款'
  })
  type: string;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string; // 交易描述

  @ApiProperty()
  @ManyToOne(() => Article, { nullable: true })
  article: Article; // 如果是阅读文章消耗的积分，关联到具体文章

  @ApiProperty()
  @Column({ nullable: true })
  orderId: string; // 如果是购买积分，关联订单号

  @ApiProperty()
  @Column('simple-enum', { 
    enum: ['pending', 'success', 'failed'],
    default: 'success'
  })
  status: string;

  @ApiProperty()
  @CreateDateColumn({
    type: 'datetime',
    comment: '创建时间',
    name: 'create_at',
  })
  createAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'datetime',
    comment: '更新时间',
    name: 'update_at',
  })
  updateAt: Date;
}