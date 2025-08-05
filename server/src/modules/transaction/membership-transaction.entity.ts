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
import { MembershipType } from '../membership/membership-type.entity';

@Entity()
export class MembershipTransaction {
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
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // 支付金额

  @ApiProperty()
  @Column()
  orderId: string; // 订单号

  @ApiProperty()
  @Column('simple-enum', { enum: ['pending', 'success', 'failed'] })
  status: string; // 支付状态

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  paymentMethod: string; // 支付方式

  @ApiProperty()
  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date; // 支付时间

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