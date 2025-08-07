import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Article } from './article.entity';

@Entity()
export class ArticlePurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column()
  articleId: string;

  @Column()
  pointsUsed: number;

  @CreateDateColumn()
  purchaseDate: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Article)
  @JoinColumn({ name: 'articleId' })
  article: Article;
}