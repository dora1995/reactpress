import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MembershipType {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string; // 会员类型名称

  @ApiProperty()
  @Column({ type: 'int', nullable: true })
  type: number; // 会员类型编号，用于逻辑判断，可为空

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  description: string; // 会员类型描述

  @ApiProperty()
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number; // 价格

  @ApiProperty()
  @Column({ type: 'int' })
  duration: number; // 有效期（天数）

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean; // 是否启用

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