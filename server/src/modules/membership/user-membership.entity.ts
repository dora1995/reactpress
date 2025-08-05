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
import { MembershipType } from './membership-type.entity';

@Entity()
export class UserMembership {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty()
  @ManyToOne(() => MembershipType)
  membershipType: MembershipType;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  startAt: Date; // 开始时间

  @ApiProperty()
  @Column({ type: 'timestamp' })
  expireAt: Date; // 过期时间

  @ApiProperty()
  @Column({ type: 'boolean', default: true })
  isActive: boolean; // 是否有效

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